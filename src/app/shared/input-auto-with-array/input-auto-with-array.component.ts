import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
  Optional,
  Self,
  SimpleChanges,
  Output,
  EventEmitter,
} from "@angular/core";
import {
  AbstractControl,
  ControlValueAccessor,
  FormControl,
  NgControl,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from "@angular/forms";

import { coerceNumberProperty } from "@angular/cdk/coercion";

import { Observable, Subject } from "rxjs";
import { debounceTime, startWith, map } from "rxjs/operators";

/**
 * Validates if the value passed has a code in order to be declared as an
 * object provided by material autocomplete options
 */
function isAutocompleteOption(value: any): boolean {
  if (value === "") return true;
  if (!value || typeof value === "string") return false;
  return true;
  // return value.id !== undefined || value[this.displayField] !== undefined;
}

/**
 * Validates the control value to have an `id` attribute. It is expected
 * control value to be an object.
 */
function containsIdValidation(control: AbstractControl): ValidationErrors {
  return isAutocompleteOption(control.value) ? null : { invalid: true };
}

@Component({
  selector: "input-auto-with-array",
  templateUrl: "./input-auto-with-array.component.html",
  styleUrls: ["./input-auto-with-array.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputAutoWithArrayComponent implements OnInit, ControlValueAccessor, OnChanges {
  @Input() refresh: Subject<boolean>;
  @Input() placeholder = "Please select";
  @Input() placeholderxs = "Please select";
  @Input() required: boolean = true;
  @Input() disabled: boolean = false;
  @Input() options: any[];
  @Input() value: any;
  @Input() displayField: string = "name";
  @Input() valueField: string;
  @Output() valueChanged = new EventEmitter<any>();
  @Input() readonly: boolean = false;
  options$: Observable<any[]>;

  // Inner form control to link input text changes to mat autocomplete
  inputControl: FormControl;
  noResults = false;
  isSearching = false;

  private _lengthToTriggerSearch = 0;

  @Input()
  set lengthToTriggerSearch(value: number) {
    this._lengthToTriggerSearch = coerceNumberProperty(value, 0);
  }

  constructor(@Optional() @Self() private controlDir: NgControl, private changeDetectorRef: ChangeDetectorRef) {
    if (this.controlDir) {
      this.controlDir.valueAccessor = this;
    }
  }
  ngOnInit() {
    this.inputControl = new FormControl("", this.validators);
    this.options$ = this.inputControl.valueChanges.pipe(
      debounceTime(100),
      startWith(""),
      map((val) => {
        return this._filter(val);
      })
    );

    if (this.value) {
      this.inputControl.setValue(this.value);
    } else {
      setTimeout(() => {
        this.inputControl.setValue("");
      }, 50);
    }
    if (this.disabled) {
      this.inputControl.disable();
    }
    // if (this.readonly) {
    //   this.inputControl
    // }

    if (this.controlDir) {
      // Set validators for the outer ngControl equals to the inner
      const control = this.controlDir.control;
      const validators = control.validator ? [control.validator, this.inputControl.validator] : this.inputControl.validator;
      control.setValidators(validators);
      // Update outer ngControl status
      control.updateValueAndValidity({ emitEvent: false });
    }
    if (this.refresh) {
      this.refresh.subscribe((v) => {
        setTimeout(() => {
          if (this.options && this.options.indexOf(this.value) < 0) {
            this.inputControl.setValue("");
          } else {
            this.inputControl.setValue(this.value);
          }
        }, 100);
      });
    }
  }

  _filter(val) {
    if (!this.options) {
      return val;
    }
    if (typeof val === "object") {
      this.value = val;
      this.valueChanged.emit(this.value);
    }

    var value: string = "";
    if (typeof val !== "string") {
      value = val[this.displayField].toUpperCase();
    } else {
      value = val.toUpperCase();
    }
    return this.options.filter((p) => p[this.displayField] ? p[this.displayField].toUpperCase().includes(value) : []); // eslint-disable-line
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.options) {
      if (this.isSearching) {
        this.isSearching = false;
        if (!changes.options.firstChange && !changes.options.currentValue.length) {
          this.noResults = true;
        } else {
          this.noResults = false;
        }
      }
    }
  }

  clear() {
    if (this.readonly) {
      return;
    }
    this.value = undefined;
    this.valueChanged.emit(this.value);
    setTimeout(() => {
      this.inputControl.setValue("");
    }, 50);
  }

  /**
   * Allows Angular to update the inputControl.
   * Update the model and changes needed for the view here.
   */
  writeValue(obj: any): void {
    obj && this.inputControl.setValue(obj);
  }

  /**
   * Allows Angular to register a function to call when the inputControl changes.
   */
  registerOnChange(fn: any): void {
    // Pass the value to the outer ngControl if it has an id otherwise pass null
    // this.inputControl.valueChanges.pipe(debounceTime(100)).subscribe({
    //   next: (value) => {
    //     if (typeof value === "string") {
    //       if (this.isMinLength(value)) {
    //         this.isSearching = true;
    //         /**
    //          * Fire change detection to display the searching status option
    //          */
    //         this.changeDetectorRef.detectChanges();
    //         fn(value.toUpperCase());
    //       } else {
    //         this.isSearching = false;
    //         this.noResults = false;
    //         fn(null);
    //       }
    //     } else {
    //       fn(value);
    //     }
    //   },
    // });
  }

  /**
   * Allows Angular to register a function to call when the input has been touched.
   * Save the function as a property to call later here.
   */
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  /**
   * Allows Angular to disable the input.
   */
  setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.inputControl.disable() : this.inputControl.enable();
  }

  /**
   * Function to call when the input is touched.
   */
  onTouched() {}

  /**
   * Method linked to the mat-autocomplete `[displayWith]` input.
   * This is how result name is printed in the input box.
   */
  displayFn(result): string | undefined {
    if (this.valueField) {
      return result;
    }
    return result ? result[this.displayField] : undefined;
  }

  isMinLength(value: string) {
    return value.length >= this._lengthToTriggerSearch;
  }

  private get validators(): ValidatorFn[] {
    if (this.required) {
      if (this.valueField) {
        return [Validators.required];
      }
      return [Validators.required, containsIdValidation];
    }
    if (!this.valueField) {
      return [containsIdValidation];
    }
  }
}

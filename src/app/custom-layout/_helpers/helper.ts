export class Helper{

    public static dev = true;

    public static url(str){
        if(this.dev){
            return config.apiDevUrl + str;
        }else{
            return config.apiUrl + str;

        }
    }
}
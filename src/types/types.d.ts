export interface PostInterface {
    id : String,
    title : String,
    content : String,
    created_at : Date,
    updated_at : Date,
    user_email : string,
    tag : string[],
    category : string,
    view : string,
    is_public : boolean
}
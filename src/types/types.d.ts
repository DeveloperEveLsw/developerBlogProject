export interface PostInterface {
    id : String,
    title : String,
    context : String,
    created_at : Date,
    updated_at : Date,
    user_email : string,
    tag : string[],
    category : string,
    view : string
}
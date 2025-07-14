export interface PostInterface {
    id : String,
    title : String,
    content : String,
    created_at : Date,
    updated_at : Date,
    user_email : string,
    tags : string[],
    category : string,
    view : number
}

export interface Tag {
    tag_id: number,
    tag_text: string
}
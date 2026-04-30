export type Task = {
    type: string,
    description: string,
    status: number,
    url:string,
    dueDate?: Date,
    supervisor: string
    imageUrl?: string
}
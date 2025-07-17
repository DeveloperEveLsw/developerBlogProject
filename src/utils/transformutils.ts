let form = [
    ['year',    '%년'],
    ['month',   '%월'],
    ['date',    '%일'],
    ['day',    ['일', '월', '화', '수', '목', '금', '토']],
    ['hours',   '%시'],
    ['minutes', '%분'],
    ['seconds', '%초']
]

export function transformDate(stringDate: string, formString: any[], replaceKey: string = '%', pad: number=0) {

    const date = new Date(stringDate)
    const a = formString.map( ([key,format])=> {
        let value: string | number = ''
        switch (key) {
            case 'year':
                value = format.replace(replaceKey, String(date.getFullYear()).padStart(pad, '0'))
                break;
            case 'month':
                value = format.replace(replaceKey, String(date.getMonth()+1).padStart(pad, '0'))
                break;
            case 'date':
                value = format.replace(replaceKey, String(date.getDate()).padStart(pad, '0'))
                break;
            case 'day':
                value = format[date.getDay()]
                break;
            case 'hours':
                value = format.replace(replaceKey, String(date.getHours()).padStart(pad, '0'))
                break;
            case 'minutes':
                value = format.replace(replaceKey, String(date.getMinutes()).padStart(pad, '0'))
                break;
            case 'seconds':
                value = format.replace(replaceKey, String(date.getSeconds()).padStart(pad, '0'))
                break;
        }
        return value
    } ).join("")

    return a
}


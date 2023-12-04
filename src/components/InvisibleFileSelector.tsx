import React from 'react'

interface InvisibleFileSelectorOptions {
    onFileSelected: (files: File[]) => void
    accept?: string
    multiple?: boolean
    id: string
}


export default function (props: InvisibleFileSelectorOptions) {
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            props.onFileSelected(Array.from(e.target.files))
            e.target.type = "text"
            e.target.type = "file"
        }
    }


    return <input
        id={props.id}
        type="file"
        onChange={onChange}
        style={{display: "none"}}
        accept={props.accept}/>

}
import React from 'react';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

export default (props) => {
    return (
        <>
            <CKEditor 
                editor={ ClassicEditor }
                id={ props.editorId }
                data={ props.editorData }
                config={{
                    placeholder: props.placeholder || '',
                    //width: '100%',
                    //toolbar: ['bold', 'italic'],
                }}
                onReady={editor => {
                }}
                onChange={(event, editor) => {
                    const data = editor.getData();
                    props.onEditorChange(data);
                }}
            />
        </>
    );
}
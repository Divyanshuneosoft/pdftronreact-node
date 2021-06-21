import React, { useEffect, useRef } from 'react';
import webviewer from '@pdftron/webviewer';
import {useHistory} from 'react-router-dom'
const Loadpdf = (props) => {
    const viewer = useRef()
    const history = useHistory()
    useEffect(() => {
        (async () => {
            try {
                let pdfFile = 'blank';
                const query = new URLSearchParams(props.location.search).get('document')
                if(query) pdfFile = query;
                const instance = await webviewer({
                    path: 'lib',
                    initialDoc:`http://localhost:4000/load-pdf?name=${pdfFile}`
                }, viewer.current)
                if(pdfFile === "template"){
                    const {docViewer} = instance
                    docViewer.on('documentLoaded',()=>{
                        instance.setHeaderItems(header => {
                            header.push({
                                type: 'actionButton',
                                img: 'https://img.icons8.com/android/2x/edit.png',
                                onClick: async () => {
                                    history.push('/edit')
                                }
                            });
                        });
                    })
                }
           
            } catch (error) {
                throw error
            }
        })()
    }, [props.location.search])
    return (
        <div>
            <div className="webviewer" ref={viewer} style={{ height: "100vh" }}></div>

        </div>
    )
}

export default Loadpdf

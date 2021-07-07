import React, { useEffect, useRef } from 'react';
import {useHistory} from 'react-router-dom'
import webviewer from '@pdftron/webviewer';


const Annonation = () => {
    const viewer = useRef();
    const history = useHistory()
    useEffect(() => {
        (async () => {
            var instance = await webviewer({
                path: 'lib',
                initialDoc: 'blank.pdf'
            }, viewer.current)
            const { docViewer, Annotations, Tools, CoreControls } = instance;

            const annotationManager = docViewer.getAnnotationManager()
            class TagAnnotation extends Annotations.CustomAnnotation {
                constructor() {
                    super('tag')
                    this.subject = 'tag';
                }
                draw(ctx, pageMatrix) {
                    // the setStyles function is a function on markup annotations that sets up
                    // certain properties for us on the canvas for the annotation's stroke thickness.
                    this.setStyles(ctx, pageMatrix);

                    // first we need to translate to the annotation's x/y coordinates so that it's
                    // drawn in the correct location
                    ctx.translate(this.X, this.Y);
                    ctx.beginPath();
                    ctx.arc(100, 15, 15, 0, 2 * Math.PI);
                    ctx.closePath()
                    ctx.stroke();


                }
                getContents(){
                }

            }
            TagAnnotation.prototype.elementName = 'tag';
            annotationManager.registerAnnotationType(TagAnnotation.prototype.elementName, TagAnnotation)
            class TagCreateTool extends Tools.GenericAnnotationCreateTool {
                constructor(doc) {
                    // TriangleAnnotation is the class (function) for our annotation we defined previously
                    super(doc, TagAnnotation);
                }
            };
            instance.registerTool({
                toolName: 'AnnotationCreateTag',
                toolObject: new TagCreateTool(docViewer),
                buttonImage: 'https://img.icons8.com/plumpy/50/000000/tag.png',
                buttonName: 'tagToolButton',
                tooltip: 'Tag'
            }, TagAnnotation);

            instance.setHeaderItems((header) => {
                header.getHeader('toolbarGroup-Annotate').get('freeHandToolGroupButton').insertBefore({
                    type: 'toolButton',
                    toolName: 'AnnotationCreateTag'
                });
            })
            instance.setHeaderItems(header => {
                header.push({
                  type: 'actionButton',
                  img: 'https://img.icons8.com/plumpy/50/000000/tag.png',
                  onClick: () => {
                      history.push('/mail')
                  }
                });
              });
            docViewer.on('documentLoaded', async () => {
                instance.setToolMode('AnnotationCreateTag');
                let response = await fetch('http://localhost:4000/load-annotation')
                if (response.status !== 200) return;
                let xmldata = await response.text()
                const annotations = await annotationManager.importAnnotCommand(xmldata)
                annotations.forEach(a => {
                    annotationManager.redrawAnnotation(a)
                })

                annotationManager.on('annotationChanged', async (annotations, action, { imported }) => {
                    const xdfString = await annotationManager.getAnnotCommand()
                    if (imported) return;
                    fetch('http://localhost:4000/save-annotation', {
                        method: 'POST',
                        body: xdfString
                    })
                })
            })
        })()
    })
    return (
        <>
            <div className="webviewer" ref={viewer} style={{ height: "100vh" }}></div>

        </>
    )
}

export default Annonation

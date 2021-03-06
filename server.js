const express = require('express');
const app = express();
const { PDFNet } = require('@pdftron/pdfnet-node');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const communication = require('./communication');
const port = process.env.PORT || 4000;
app.use(cors())
app.use(express.text())
app.use(express.json())
app.get('/load-pdf', async (req, res) => {
    const main = async () => {
        const doc = await PDFNet.PDFDoc.create();
        const page = await doc.pageCreate();
        doc.pagePushBack(page);
        doc.save(`${req.query.name}.pdf`, PDFNet.SDFDoc.SaveOptions.e_linearized);
    }
    try {
        if(!fs.existsSync(path.resolve(__dirname,`${req.query.name}.pdf`))){
            await PDFNet.runWithCleanup(main)
            await PDFNet.shutdown()
        }
         fs.readFile(`${path.resolve(__dirname, `${req.query.name}.pdf`)}`,(error,data)=>{
            if (error)  return res.status(503).send({ message: 'service unavailable' })
            return res.setHeader('ContentType', 'application/pdf').status(200).end(data)
         })
    } catch (error) {
        return res.status(503).send({ message: 'service unavailable' })

    }
})
app.post('/edit-pdf',async(req,res)=>{
    try {
        var pdfname = `template-${new Date().toISOString()}`
        const inputPath = path.resolve(__dirname,'template.pdf')
        const outpath = path.resolve(__dirname,`${pdfname}.pdf`)
        const replaceText = async()=>{
          const pdfdoc = await PDFNet.PDFDoc.createFromFilePath(inputPath);
          await pdfdoc.initSecurityHandler()
          const replacer = await PDFNet.ContentReplacer.create()
          const page = await pdfdoc.getPage(1)
          for(let key in req.body){
              await replacer.addString(key,req.body[key])
          }
          await replacer.process(page)
          pdfdoc.save(outpath,PDFNet.SDFDoc.SaveOptions.e_linearized)
        }
        await PDFNet.runWithCleanup(replaceText)
    } catch (error) {
        return res.status(500).send({'message':'service unavailable'})
    }
    return res.status(200).send({pdfname:pdfname})
})
app.post('/send-mail',async(req,res)=>{
    try {
       await communication.sendEmail(req.body) 
    } catch (error) {
        return res.status(500).send({'message':'service unavailable'})
    }
    return res.status(200).send({message:'Mail sent successfully'})

})
app.post('/save-annotation',async(req,res)=>{
    fs.writeFile('annotation.xml',req.body,(err)=>{
        if(err) return res.status(500).send({message:"File error"})
        return res.status(200).send({message:'annotation save successfully'})
    })
})
app.get('/load-annotation',async(req,res)=>{
    const data = fs.readFileSync('annotation.xml',{encoding:'utf-8',flag:'r'})
    res.set('Content-Type', 'text/xml')
    return res.status(200).send(data)
})
app.listen(port, () => {
    console.log(`port is connected on ${port}`)
})
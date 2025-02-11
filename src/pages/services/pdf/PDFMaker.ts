import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions } from 'pdfmake/interfaces';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(<any>pdfMake).addVirtualFileSystem(pdfFonts);

  export default async function PDFMaker( docDef: TDocumentDefinitions, pdfName: string ) {
      const pdfDoc = pdfMake.createPdf(docDef);
      pdfDoc.open()
      pdfDoc.download(pdfName);
  }
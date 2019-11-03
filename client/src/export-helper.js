import { savePDF } from "@progress/kendo-react-pdf";
import Moment from "moment";

class DocService {
    createPdf = html => {
        savePDF(html, {
            paperSize: "Letter",
            fileName: `report-${Moment(Date.now()).format("YYYY-MM-DD")}.pdf`,
            margin: 3
        });
    };
}

const Doc = new DocService();
export default Doc;

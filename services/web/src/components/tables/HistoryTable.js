import { useState, useEffect } from "react";
import invoiceHandler from "../../models/invoiceModel";
import "../../assets/css/style.css"


function HistoryTable({token, userId}) {
  const [invoices, setInvoices] = useState([]);
  const [currentInvoice, setCurrentInvoice] = useState([]);

  async function getInvoices() {
    const result = await invoiceHandler.getInvoices(userId, token, {userId: userId});
    setInvoices(result);
  }

  function selectedInvoice() {
    const selectedInvoiceId = document.getElementById("selectInvoice").value;
    const selectedInvoice = invoices[selectedInvoiceId];
    setCurrentInvoice(selectedInvoice);
  }

  useEffect(() => {
    (async () => {
      await getInvoices();
    })();
  }, []);

  return (
    <div>
      {invoices.length > 0 &&
        <select
          id="selectInvoice"
          onChange={selectedInvoice}
        >
          <option value="-99" key="0">Select invoice</option>
          {invoices.map((invoice, index) => <option value={index} key={index}>{invoice.start.time}</option>)}
        </select>
      }
      {invoices.length === 0 &&
        <p>You have no previous trips</p>
      } 
      {currentInvoice.length > 0 &&
        <div className="table-container">
          <table className="styled-table">
            <thead>
              <tr>
                <th>Start position</th>
                <th>Start time</th>
                <th>End position</th>
                <th>End time</th>
                <th>Price</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{currentInvoice.start.lat} {currentInvoice.start.long}</td>
                <td>{currentInvoice.start.time}</td>
                <td>{currentInvoice.end.lat} {currentInvoice.end.long}</td>
                <td>{currentInvoice.end.time}</td>
                <td>{currentInvoice.price}</td>
                <td>{currentInvoice.status}</td>
              </tr>
            </tbody>
          </table>
        </div>
      }
    </div>
    );
}

export default HistoryTable;
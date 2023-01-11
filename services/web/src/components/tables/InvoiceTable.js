import React, { useState, useEffect, useRef } from 'react';
import invoiceHandler from '../../models/invoiceModel'

export function InvoiceTable({token, loginId}) {

    const userId = useRef(null);
    const invoiceId = useRef(null);
    const [invoices, setInvoices] = useState(null);

    const inputUserId = useRef(null);
    const inputStatus = useRef(null);
    const inputStartLat = useRef(null);
    const inputStartLng = useRef(null);
    const inputStartTime = useRef(null);
    const inputEndLat = useRef(null);
    const inputEndLng = useRef(null);
    const inputEndTime = useRef(null);
    const inputPrice = useRef(null);

    useEffect(() => {
      }, []);

    async function getInvoices(idObject) {
        const result = await invoiceHandler.getInvoices(loginId, token, idObject);
        setInvoices(result);
    }

    function GetForInvoiceBtn() {
        return (
            <div>
                <input type="text" ref={invoiceId} placeholder="invoiceId" className="user-input"></input>
                <button className="small-btn" onClick={() => {getInvoices({invoiceId: invoiceId})}}>
                    Get invoice by invoiceId
                </button>
            </div>
        )
    }

    function GetForUserBtn() {
        return (
            <div>
                <input type="text" ref={userId} placeholder="userId" className="user-input"></input>
                <button className="small-btn" onClick={() => {getInvoices({userId: userId})}}>
                    Get invoices by userId
                </button>
            </div>
        )
    }

    function MakeInvoice() {
        return (
            <div>
                <div className="make-invoice-container">
                    <input type="text" ref={inputUserId} placeholder="userId"></input>
                    <input type="text" ref={inputStatus} placeholder="status"></input>
                    <input type="text" ref={inputPrice} placeholder="Price"></input>
                    <input type="text" ref={inputStartLat} placeholder="start latitude"></input>
                    <input type="text" ref={inputStartLng} placeholder="start longitude"></input>
                    <input type="text" ref={inputStartTime} placeholder="start time"></input>
                    <input type="text" ref={inputEndLat} placeholder="end latitude"></input>
                    <input type="text" ref={inputEndLng} placeholder="end longitude"></input>
                    <input type="text" ref={inputEndTime} placeholder="end time"></input>
                    <button onClick={() => {invoiceHandler.addInvoice(loginId, token, inputUserId, inputStatus, inputStartLat, inputStartLng, inputStartTime, inputEndLat, inputEndLng, inputEndTime, inputPrice)}}>Add invoice</button>
                </div>
                <hr className="line"></hr>
            </div>
        )
    }

    if (!invoices) {
        return (
            <div>
                <MakeInvoice/>
                <GetForUserBtn/>
                <GetForInvoiceBtn/>
                Loading...
            </div>
        )
    }

    if (invoices.length == 0) {
        return (
            <div>
                <MakeInvoice/>
                <GetForUserBtn/>
                <GetForInvoiceBtn/>
                userId '{loginId}' has no invoices
            </div>
        )
    }

    return (
        <div>
            <MakeInvoice/>
            <GetForUserBtn/>
            <GetForInvoiceBtn/>
            <div>
                <table className="styled-table">
                    <thead>
                        <tr>
                            <th>invoiceId</th>
                            <th>userId</th>
                            <th>status</th>
                            <th>start latitude</th>
                            <th>start longitude</th>
                            <th>start time</th>
                            <th>end latitude</th>
                            <th>end longitude</th>
                            <th>end time</th>
                            <th>price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoices.map((invoice) => (
                            <tr key={invoice._id}>
                                <td className="hover-parent">
                                    <div className="hover-box">{invoice._id.toString().substring(0, 6)}</div>
                                    <div className="info-box">{invoice._id.toString().substring(6)}</div>
                                </td>
                                <td className="hover-parent">
                                    <div className="hover-box">{invoice.userId.toString().substring(0, 6)}</div>
                                    <div className="info-box">{invoice.userId.toString().substring(6)}</div>
                                </td>
                                <td style={{ color: invoice.status === "success" ? "green" : invoice.status === "pending" ? "orange" : invoice.status === "riding" ? "gray" : "black"}}>{invoice.status}</td>
                                <td className="hover-parent">
                                    <div className="hover-box">{invoice.start.lat.toString().substring(0, 6)}</div>
                                    <div className="info-box">{invoice.start.lat.toString().substring(6)}</div>
                                </td>
                                <td className="hover-parent">
                                    <div className="hover-box">{invoice.start.lng.toString().substring(0, 6)}</div>
                                    <div className="info-box">{invoice.start.lng.toString().substring(6)}</div>
                                </td>
                                <td className="hover-parent">
                                    <div className="info-box">{invoice.start.time.toString().substring(0, 11)}</div>
                                    <div className="hover-box">{invoice.start.time.toString().substring(11)}</div>
                                </td>
                                <td className="hover-parent">
                                    <div className="hover-box">{invoice.end.lat.toString().substring(0, 6)}</div>
                                    <div className="info-box">{invoice.end.lat.toString().substring(6)}</div>
                                </td>
                                <td className="hover-parent">
                                    <div className="hover-box">{invoice.end.lng.toString().substring(0, 6)}</div>
                                    <div className="info-box">{invoice.end.lng.toString().substring(6)}</div>
                                </td>
                                <td className="hover-parent">
                                    <div className="info-box">{invoice.end.time.toString().substring(0, 11)}</div>
                                    <div className="hover-box">{invoice.end.time.toString().substring(11)}</div>
                                </td>
                                <td>{invoice.price} kr</td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default InvoiceTable;
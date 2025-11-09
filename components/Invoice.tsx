import React, { useState, useEffect } from 'react';
import { Sale, BusinessDetails } from '../types';
import { ArrowLeftIcon, PrinterIcon, SaveIcon } from './icons/Icons';
import { CURRENCY_SYMBOL } from '../constants';

// --- Start Number to Words Conversion Logic for BDT ---
const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

function convertGroup(n: number): string {
    let output = '';
    if (n >= 100) {
        output += ones[Math.floor(n / 100)] + ' Hundred';
        n %= 100;
        if (n > 0) output += ' ';
    }
    if (n >= 20) {
        output += tens[Math.floor(n / 10)];
        n %= 10;
        if (n > 0) {
          output += ' ' + ones[n];
        }
    } else if (n >= 10) {
        output += teens[n - 10];
    } else if (n > 0) {
        output += ones[n];
    }
    return output;
}


function numberToWordsBDT(num: number): string {
    if (num === null || num === undefined) return '';
    if (num < 0) return `Minus ${numberToWordsBDT(Math.abs(num))}`;
    if (num === 0) return 'Zero Taka Only';

    const taka = Math.floor(num);
    const paisa = Math.round((num - taka) * 100);

    let takaWords = '';

    if (taka > 0) {
        const crores = Math.floor(taka / 10000000);
        const lakhs = Math.floor((taka % 10000000) / 100000);
        const thousands = Math.floor((taka % 100000) / 1000);
        const hundreds = taka % 1000;

        if (crores > 0) {
            takaWords += convertGroup(crores) + ' Crore ';
        }
        if (lakhs > 0) {
            takaWords += convertGroup(lakhs) + ' Lakh ';
        }
        if (thousands > 0) {
            takaWords += convertGroup(thousands) + ' Thousand ';
        }
        if (hundreds > 0) {
            takaWords += convertGroup(hundreds);
        }
    }
    
    let fullWords = takaWords.trim();
    if (fullWords && taka > 0) {
        fullWords += ' Taka';
    }

    if (paisa > 0) {
        if (fullWords) {
            fullWords += ' and ';
        }
        fullWords += convertGroup(paisa) + ' Paisa';
    }
    
    if (!fullWords) return 'Zero Taka Only';

    return (fullWords.charAt(0).toUpperCase() + fullWords.slice(1) + ' Only').replace(/\s+/g, ' ').trim();
}
// --- End Number to Words Conversion Logic ---


interface InvoiceProps {
  sale: Sale;
  businessDetails: BusinessDetails;
  onBack: () => void;
  onSave: (sale: Sale) => void;
}

const Invoice: React.FC<InvoiceProps> = ({ sale, businessDetails, onBack, onSave }) => {
    const [editableSale, setEditableSale] = useState<Sale>(sale);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

    // CRITICAL FIX: This ensures that if the parent component passes a new `sale` prop,
    // the component's internal state is updated to reflect that change. This makes the
    // component truly dynamic and fixes the bug where details would not show up.
    useEffect(() => {
        setEditableSale(sale);
    }, [sale]);
    
    const MIN_ROWS = 10;
    const emptyRows = Math.max(0, MIN_ROWS - (editableSale.items?.length || 0));

    const handlePrint = () => {
        window.print();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditableSale(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        setSaveStatus('saving');
        onSave(editableSale);
        setTimeout(() => {
            setSaveStatus('saved');
            setTimeout(() => setSaveStatus('idle'), 2000);
        }, 500);
    };

    return (
        <>
            <style>
                {`
                @media print {
                    body {
                        background-color: white !important;
                        -webkit-print-color-adjust: exact !important;
                        color-adjust: exact !important;
                    }
                    .no-print {
                        display: none !important;
                    }
                    main {
                        padding: 0 !important;
                        margin: 0 !important;
                        overflow: visible !important;
                    }
                    .printable-invoice-container {
                        padding: 0 !important;
                        margin: 0 !important;
                        background-color: white !important;
                    }
                    .printable-invoice {
                        margin: 0 auto;
                        padding: 0;
                        box-shadow: none !important;
                        border: none !important;
                        width: 100% !important;
                        max-width: 100% !important;
                        min-height: 0;
                        height: auto;
                        border-radius: 0;
                    }
                     .printable-invoice input, .printable-invoice input:focus {
                        border: none !important;
                        box-shadow: none !important;
                        outline: none !important;
                        padding: 0 !important;
                        background-color: transparent !important;
                    }
                    @page {
                        size: A5 portrait;
                        margin: 0.5cm;
                    }
                }
                `}
            </style>
            <div className="bg-gray-200 dark:bg-gray-900 -m-4 sm:-m-6 lg:-m-8 p-2 sm:p-6 lg:p-8 w-full min-h-full printable-invoice-container">
                 <div className="flex justify-between items-center mb-4 no-print max-w-xl mx-auto">
                     <button onClick={onBack} className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
                        <ArrowLeftIcon className="mr-2" />
                        <span className="hidden sm:inline">Back</span>
                     </button>
                     <div className="flex items-center space-x-2">
                        <button onClick={handleSave} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            <SaveIcon className="mr-2" /> {saveStatus === 'saved' ? 'Saved!' : 'Save'}
                        </button>
                        <button onClick={handlePrint} className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                            <PrinterIcon className="mr-2" /> Print
                        </button>
                     </div>
                </div>

                <div className="bg-white text-gray-800 shadow-lg mx-auto w-full max-w-xl printable-invoice text-sm font-sans relative">
                    {/* Watermark */}
                    {businessDetails.watermarkLogoUrl && (
                        <img 
                            src={businessDetails.watermarkLogoUrl} 
                            alt="Watermark" 
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5/6 max-w-lg object-contain opacity-10 z-0 pointer-events-none"
                        />
                    )}

                    {/* Header */}
                    <div className="relative z-10 p-4 bg-yellow-50/90">
                        <div className="grid grid-cols-12 gap-4 items-start">
                           <div className="col-span-4 text-center">
                                <h1 className="font-bold text-xl leading-tight">{businessDetails.name}</h1>
                            </div>
                           <div className="col-span-3 flex justify-center space-x-4">
                                {businessDetails.qrCode1_url && (
                                  <div className="text-center">
                                    <img src={businessDetails.qrCode1_url} alt="QR Code 1" className="w-14 h-14 object-contain" />
                                  </div>
                                )}
                                {businessDetails.qrCode2_url && (
                                  <div className="text-center">
                                    <img src={businessDetails.qrCode2_url} alt="QR Code 2" className="w-14 h-14 object-contain" />
                                  </div>
                                )}
                            </div>
                            <div className="col-span-5 text-left text-xs">
                                <p>Address: {businessDetails.address}</p>
                                <p>E-mail: {businessDetails.email}</p>
                                <p>Phone: {businessDetails.phone}</p>
                            </div>
                        </div>
                    </div>

                    {/* Customer Info */}
                    <div className="relative z-10 p-3 bg-gray-800/95 text-white text-sm">
                        <div className="grid grid-cols-2 gap-x-6 gap-y-1">
                            <div className="flex items-center">
                                <label className="font-semibold w-16">No.</label>
                                <span className="font-bold flex-1 border-b border-gray-600 py-1">{editableSale.invoiceNumber}</span>
                            </div>
                             <div className="flex items-center">
                                <label className="font-semibold w-16">Date</label>
                                <input type="text" value={new Date(editableSale.date).toLocaleDateString()} readOnly className="bg-transparent w-full focus:outline-none flex-1 border-b border-gray-600 py-1" />
                            </div>
                            <div className="flex items-center">
                                <label className="font-semibold w-16">Name</label>
                                <input type="text" name="walkInCustomerName" value={editableSale.customer?.name || editableSale.walkInCustomerName || ''} onChange={handleInputChange} className="bg-transparent w-full focus:outline-none flex-1 border-b border-gray-600 py-1"/>
                            </div>
                             <div className="flex items-center">
                                <label className="font-semibold w-16">Mobile</label>
                                <input type="text" name="walkInCustomerPhone" value={editableSale.customer?.phone || editableSale.walkInCustomerPhone || ''} onChange={handleInputChange} className="bg-transparent w-full focus:outline-none flex-1 border-b border-gray-600 py-1"/>
                            </div>
                             <div className="flex items-center">
                                <label className="font-semibold w-16">Address</label>
                                <input type="text" value={editableSale.customer?.email || ''} className="bg-transparent w-full focus:outline-none flex-1 py-1" placeholder=""/>
                            </div>
                        </div>
                    </div>

                    {/* Items Table */}
                    <div className="relative z-10">
                        <table className="min-w-full border-collapse">
                            <thead className="bg-green-600 text-white">
                                <tr>
                                    <th className="p-2 text-center text-xs font-semibold w-12 border-l border-r border-gray-300">Sl. No.</th>
                                    <th className="p-2 text-center text-xs font-semibold border-r border-gray-300">Description</th>
                                    <th className="p-2 text-center text-xs font-semibold w-24 border-r border-gray-300">Quantity</th>
                                    <th className="p-2 text-center text-xs font-semibold w-24 border-r border-gray-300">Rate</th>
                                    <th className="p-2 text-center text-xs font-semibold w-28 border-r border-gray-300">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {editableSale.items && editableSale.items.map((item, index) => (
                                    <tr key={item.productId} className="border-b border-gray-300">
                                        <td className="p-2 text-center align-middle border-l border-r border-gray-300 text-gray-900">{index + 1}</td>
                                        <td className="p-2 text-center align-middle border-r border-gray-300 text-gray-900">{item.name || 'N/A'}</td>
                                        <td className="p-2 text-center align-middle border-r border-gray-300 text-gray-900">{(item.quantity || 0)} kg</td>
                                        <td className="p-2 text-center align-middle border-r border-gray-300 text-gray-900">{CURRENCY_SYMBOL}{(item.price || 0).toFixed(2)}</td>
                                        <td className="p-2 text-center align-middle border-r border-gray-300 text-gray-900">{CURRENCY_SYMBOL}{((item.price || 0) * (item.quantity || 0)).toFixed(2)}</td>
                                    </tr>
                                ))}
                                {Array.from({ length: emptyRows }).map((_, index) => (
                                    <tr key={`empty-${index}`} style={{height: '32px'}} className="border-b border-gray-300">
                                        <td className="border-l border-r border-gray-300">&nbsp;</td>
                                        <td className="border-r border-gray-300"></td>
                                        <td className="border-r border-gray-300"></td>
                                        <td className="border-r border-gray-300"></td>
                                        <td className="border-r border-gray-300"></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer */}
                    <div className="relative z-10 bg-yellow-50/90 p-4">
                        <div className="flex justify-between items-start">
                            <div className="w-2/3">
                                <p className="font-semibold">Taka in Words: <span className="font-normal">{numberToWordsBDT(editableSale.total)}</span></p>
                            </div>
                            <div className="w-1/3 max-w-[200px] border border-gray-400">
                                <table className="w-full">
                                    <tbody>
                                        <tr className="border-b border-gray-400">
                                            <td className="font-semibold p-1 text-black">Total</td>
                                            <td className="text-right p-1 text-gray-900">{CURRENCY_SYMBOL}{(editableSale.total || 0).toFixed(2)}</td>
                                        </tr>
                                         <tr className="border-b border-gray-400">
                                            <td className="font-semibold p-1 text-black">Paid</td>
                                            <td className="text-right p-1 text-gray-900">{CURRENCY_SYMBOL}{(editableSale.paidAmount || 0).toFixed(2)}</td>
                                        </tr>
                                         <tr>
                                            <td className="font-semibold p-1 text-black">Due</td>
                                            <td className="text-right p-1 text-gray-900">{CURRENCY_SYMBOL}{(editableSale.due || 0).toFixed(2)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="mt-12">
                            <div className="flex justify-between items-end">
                                <div className="w-1/3 text-center">
                                    <div className="border-t-2 border-gray-400 border-dotted"></div>
                                    <p className="mt-1 font-semibold text-xs">Customer's Signature</p>
                                </div>
                                <div className="w-1/3 text-center">
                                    <div className="border-t-2 border-gray-400 border-dotted"></div>
                                    <p className="mt-1 font-semibold text-xs">Authorized Signature</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="relative z-10 h-2 bg-green-600"></div>
                </div>
            </div>
        </>
    );
};

export default Invoice;

import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, onSnapshot, query, orderBy, addDoc, serverTimestamp, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { Plus, Download, Filter, Search, MoreVertical, DollarSign, X, Send, FileText, CheckCircle, Eye, Printer, Mail, Trash2, Edit2 } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

const Invoices: React.FC = () => {
    const [activeTab, setActiveTab] = useState('all');
    const [invoices, setInvoices] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [editingInvoice, setEditingInvoice] = useState<any>(null);
    const [viewingInvoice, setViewingInvoice] = useState<any>(null);
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
    const [newInvoice, setNewInvoice] = useState({
        client: '',
        amount: '',
        status: 'Pending',
        date: new Date().toISOString().split('T')[0],
        email: '',
        address: '',
        description: 'Web Development Services',
        tax: '0',
        subtotal: ''
    });

    useEffect(() => {
        const q = query(collection(db, 'invoices'), orderBy('date', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setInvoices(items);
        });
        return () => unsubscribe();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');
        try {
            const invoiceId = `INV-${Math.floor(1000 + Math.random() * 9000)}`;
            await addDoc(collection(db, 'invoices'), {
                ...newInvoice,
                invoiceId,
                amount: `₹${newInvoice.amount}`,
                timestamp: serverTimestamp()
            });
            setStatus('success');
            setTimeout(() => {
                setIsCreating(false);
                setStatus('idle');
                resetForm();
            }, 2000);
        } catch (error) {
            console.error("Error creating invoice:", error);
            setStatus('idle');
        }
    };

    const handleEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');
        try {
            const docRef = doc(db, 'invoices', editingInvoice.id);
            await updateDoc(docRef, {
                ...newInvoice,
                amount: newInvoice.amount.startsWith('₹') ? newInvoice.amount : `₹${newInvoice.amount}`,
            });
            setStatus('success');
            setTimeout(() => {
                setEditingInvoice(null);
                setStatus('idle');
                resetForm();
            }, 2000);
        } catch (error) {
            console.error("Error updating invoice:", error);
            setStatus('idle');
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this invoice? This action is irreversible.')) {
            try {
                await deleteDoc(doc(db, 'invoices', id));
            } catch (error) {
                console.error("Error deleting invoice:", error);
            }
        }
    };

    const resetForm = () => {
        setNewInvoice({
            client: '',
            amount: '',
            status: 'Pending',
            date: new Date().toISOString().split('T')[0],
            email: '',
            address: '',
            description: 'Web Development Services',
            tax: '0',
            subtotal: ''
        });
    };

    const handleDownloadPDF = (invoice: any) => {
        const doc = new jsPDF() as any;
        const primaryColor = [44, 62, 80]; // Dark Slate
        const secondaryColor = [127, 140, 141]; // Grey

        // Header Rectangle
        doc.setFillColor(44, 62, 80);
        doc.rect(0, 0, 40, 297, 'F');

        // Title
        doc.setFontSize(50);
        doc.setTextColor(44, 62, 80);
        doc.setFont('helvetica', 'bold');
        doc.text('INVOICE', 50, 40);

        doc.setFontSize(14);
        doc.setTextColor(100);
        doc.setFont('helvetica', 'normal');
        doc.text('Averqon Agency | Digital Craftsmen', 50, 50);

        // Client Info
        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text('ISSUED TO', 50, 75);

        doc.setFontSize(18);
        doc.setTextColor(44, 62, 80);
        doc.setFont('helvetica', 'bold');
        doc.text(invoice.client, 50, 85);

        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.setFont('helvetica', 'normal');
        doc.text(invoice.email || 'no-email@provided.com', 50, 92);
        doc.text(invoice.address || 'Address not listed', 50, 97);

        // Meta Info (Right side)
        const rightEdge = 190;
        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text('INVOICE', rightEdge, 75, { align: 'right' });
        doc.setTextColor(44, 62, 80);
        doc.setFont('helvetica', 'bold');
        doc.text(invoice.invoiceId || invoice.id, rightEdge, 82, { align: 'right' });

        doc.setTextColor(150);
        doc.text('DATE ISSUED', rightEdge, 90, { align: 'right' });
        doc.setTextColor(44, 62, 80);
        doc.text(invoice.date, rightEdge, 97, { align: 'right' });

        // Table
        const tableData = [
            [invoice.description || 'Web Development Services', invoice.amount]
        ];

        (doc as any).autoTable({
            startY: 110,
            head: [['DESCRIPTION', 'FEES']],
            body: tableData,
            theme: 'plain',
            headStyles: {
                textColor: [44, 62, 80],
                fontStyle: 'bold',
                fontSize: 12,
                cellPadding: 5,
                lineColor: [44, 62, 80],
                lineWidth: 0.1
            },
            styles: {
                fontSize: 11,
                cellPadding: 8,
                textColor: [100, 100, 100]
            },
            columnStyles: {
                0: { cellWidth: 100 },
                1: { halign: 'right', fontStyle: 'bold', textColor: [44, 62, 80] }
            },
            margin: { left: 50 }
        });

        const finalY = (doc as any).lastAutoTable.finalY + 10;

        // Summation
        doc.setDrawColor(44, 62, 80);
        doc.line(130, finalY, rightEdge, finalY);

        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text('SUBTOTAL', 130, finalY + 10);
        doc.text(invoice.amount, rightEdge, finalY + 10, { align: 'right' });

        doc.text('TAX (0%)', 130, finalY + 18);
        doc.text('₹0.00', rightEdge, finalY + 18, { align: 'right' });

        doc.setFillColor(44, 62, 80);
        doc.rect(130, finalY + 25, 60, 15, 'F');
        doc.setTextColor(255);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('TOTAL', 135, finalY + 34);
        doc.text(invoice.amount, rightEdge - 5, finalY + 34, { align: 'right' });

        // Payment Details Footer
        doc.setTextColor(44, 62, 80);
        doc.setFontSize(10);
        doc.text('PAYMENT DETAILS :', 50, 240);
        doc.setFontSize(8);
        doc.setTextColor(100);
        doc.text('Bank Name : Global Bank Solutions', 50, 248);
        doc.text('Account No : 1234 5678 9012', 50, 253);

        // Footer Contact
        doc.setTextColor(150);
        doc.text('Averqon Headquarters, Digital District 101', rightEdge, 240, { align: 'right' });
        doc.text('www.averqon.com', rightEdge, 245, { align: 'right' });
        doc.text('+123-456-7890', rightEdge, 250, { align: 'right' });

        doc.setFillColor(44, 62, 80);
        doc.rect(0, 280, 210, 17, 'F');

        doc.save(`${invoice.invoiceId || invoice.id}_Export.pdf`);
    };

    const handleMailInvoice = (invoice: any) => {
        const subject = encodeURIComponent(`Invoice from Averqon Agency: ${invoice.invoiceId || invoice.id}`);
        const body = encodeURIComponent(`Hello ${invoice.client},\n\nPlease find your official invoice attached.\n\nInvoice ID: ${invoice.invoiceId || invoice.id}\nAmount: ${invoice.amount}\nDate: ${invoice.date}\nStatus: ${invoice.status}\n\nThank you for choosing Averqon.`);
        window.location.href = `mailto:${invoice.email || ''}?subject=${subject}&body=${body}`;
    };

    const handleExportExcel = () => {
        const dataToExport = filteredInvoices.map(inv => ({
            'ID': inv.invoiceId || inv.id,
            'Client': inv.client,
            'Amount': inv.amount,
            'Status': inv.status,
            'Date': inv.date
        }));
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(dataToExport);
        XLSX.utils.book_append_sheet(wb, ws, 'Invoices');
        XLSX.writeFile(wb, `Invoices_Export.xlsx`);
    };

    const filteredInvoices = invoices.filter(inv => {
        const matchesTab = activeTab === 'all' || inv.status?.toLowerCase() === activeTab;
        const matchesSearch = inv.client?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (inv.invoiceId || inv.id)?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
    });

    return (
        <div className="p-8 bg-zinc-950 min-h-screen text-white">
            <div className="max-w-7xl mx-auto">
                <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-4xl font-black mb-2 tracking-tighter">Finance <span className="text-indigo-500">Vault</span></h1>
                        <p className="text-gray-400">Precision billing and professional financial records for the Averqon ecosystem.</p>
                    </div>
                    <div className="flex gap-4 w-full md:w-auto">
                        <button onClick={handleExportExcel} className="flex-1 md:flex-none bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-2xl font-bold border border-white/10 transition-all flex items-center justify-center">
                            <Download className="mr-2" size={20} /> Excel Export
                        </button>
                        <button onClick={() => setIsCreating(true)} className="flex-1 md:flex-none bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center">
                            <Plus className="mr-2" size={20} /> New Record
                        </button>
                    </div>
                </header>

                <div className="flex flex-wrap items-center justify-between gap-6 mb-8">
                    <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5">
                        {['all', 'paid', 'pending', 'overdue'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-2 rounded-xl text-xs font-black uppercase transition-all ${activeTab === tab ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                    <div className="relative group flex-grow max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-500 transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Search records..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-3 focus:border-indigo-500 focus:outline-none transition-all"
                        />
                    </div>
                </div>

                <div className="glass-card rounded-[40px] border border-white/5 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/5 border-b border-white/5">
                                    <th className="px-8 py-6 text-gray-400 font-semibold uppercase text-[10px] tracking-widest">Identifier</th>
                                    <th className="px-8 py-6 text-gray-400 font-semibold uppercase text-[10px] tracking-widest">Client</th>
                                    <th className="px-8 py-6 text-gray-400 font-semibold uppercase text-[10px] tracking-widest">Capital</th>
                                    <th className="px-8 py-6 text-gray-400 font-semibold uppercase text-[10px] tracking-widest">Status</th>
                                    <th className="px-8 py-6 text-gray-400 font-semibold uppercase text-[10px] tracking-widest">Timeline</th>
                                    <th className="px-8 py-6 text-gray-400 font-semibold uppercase text-[10px] tracking-widest text-right">Operations</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredInvoices.map((inv) => (
                                    <tr key={inv.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-8 py-6 font-mono text-indigo-400 font-semibold text-sm">{inv.invoiceId || inv.id}</td>
                                        <td className="px-8 py-6 font-bold">{inv.client}</td>
                                        <td className="px-8 py-6 font-black">{inv.amount}</td>
                                        <td className="px-8 py-6">
                                            <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider ${inv.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-500' : inv.status === 'Pending' ? 'bg-amber-500/10 text-amber-500' : 'bg-red-500/10 text-red-500'}`}>
                                                {inv.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-gray-400 font-medium text-sm">{inv.date}</td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <button onClick={() => setViewingInvoice(inv)} className="p-2 hover:bg-white/10 rounded-xl transition-colors text-gray-400 hover:text-white" title="Visualize"><Eye size={18} /></button>
                                                <button onClick={() => { setEditingInvoice(inv); setNewInvoice({ ...inv, amount: inv.amount.replace('₹', '') }); }} className="p-2 hover:bg-indigo-500/10 rounded-xl transition-colors text-gray-400 hover:text-indigo-400" title="Modify"><Edit2 size={18} /></button>
                                                <button onClick={() => handleDelete(inv.id)} className="p-2 hover:bg-red-500/10 rounded-xl transition-colors text-gray-400 hover:text-red-500" title="Terminate"><Trash2 size={18} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* View Invoice Modal */}
            {viewingInvoice && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 md:p-8 bg-black/95 backdrop-blur-3xl animate-in fade-in duration-500">
                    <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl relative shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col items-stretch">
                        <button onClick={() => setViewingInvoice(null)} className="absolute right-6 top-6 z-20 p-2 bg-zinc-100 hover:bg-zinc-200 rounded-full transition-colors text-zinc-900">
                            <X size={20} />
                        </button>

                        <div className="p-12 md:p-20 text-zinc-900">
                            {/* Design matches Uploaded Image */}
                            <div className="flex justify-between items-start mb-16">
                                <div>
                                    <h2 className="text-6xl font-black text-zinc-800 tracking-tighter mb-2">INVOICE</h2>
                                    <p className="text-xl font-bold text-zinc-400">Lars Peeters Contractor <span className="text-zinc-300 font-light mx-2">|</span> Averqon</p>
                                </div>
                                <div className="text-right">
                                    <div className="bg-zinc-800 w-24 h-24 mb-6 ml-auto"></div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-20 mb-20">
                                <div>
                                    <p className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-4">ISSUED TO</p>
                                    <h3 className="text-4xl font-black text-zinc-800 mb-2">{viewingInvoice.client}</h3>
                                    <p className="text-zinc-500 font-medium">{viewingInvoice.email}</p>
                                    <p className="text-zinc-400 text-sm mt-1">{viewingInvoice.address || 'Global Headquarters'}</p>
                                </div>
                                <div className="text-right space-y-6">
                                    <div>
                                        <p className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-1">INVOICE</p>
                                        <p className="text-xl font-bold text-zinc-800 opacity-60">#{viewingInvoice.invoiceId || viewingInvoice.id}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-1">DATE ISSUED</p>
                                        <p className="text-xl font-bold text-zinc-800 opacity-60">{viewingInvoice.date}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t-4 border-zinc-800 pt-10">
                                <div className="flex justify-between mb-8">
                                    <span className="text-sm font-black text-zinc-800 uppercase tracking-widest">DESCRIPTION</span>
                                    <span className="text-sm font-black text-zinc-800 uppercase tracking-widest">FEES</span>
                                </div>
                                <div className="flex justify-between py-6 border-b border-zinc-100">
                                    <span className="text-2xl font-bold text-zinc-600">{viewingInvoice.description || 'Web Architecture Design'}</span>
                                    <span className="text-2xl font-black text-zinc-800">{viewingInvoice.amount}</span>
                                </div>

                                <div className="flex justify-end pt-12">
                                    <div className="w-64 space-y-4">
                                        <div className="flex justify-between items-center text-zinc-400 font-bold uppercase text-xs">
                                            <span>SUBTOTAL</span>
                                            <span>{viewingInvoice.amount}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-zinc-400 font-bold uppercase text-xs">
                                            <span>TAX</span>
                                            <span>₹0.00</span>
                                        </div>
                                        <div className="border-t-2 border-zinc-800 pt-4 flex justify-between items-center text-zinc-800 font-black text-2xl tracking-tighter">
                                            <span>TOTAL</span>
                                            <span>{viewingInvoice.amount}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer Actions */}
                        <div className="p-8 bg-zinc-50 border-t border-zinc-100 flex justify-between items-center">
                            <div className="flex items-center gap-6">
                                <button onClick={() => handleDownloadPDF(viewingInvoice)} className="p-4 bg-zinc-800 hover:bg-zinc-900 text-white rounded-2xl flex items-center font-bold transition-all transform hover:scale-105">
                                    <Printer className="mr-2" size={18} /> Print Document
                                </button>
                                <button onClick={() => handleMailInvoice(viewingInvoice)} className="p-4 bg-white border border-zinc-200 hover:border-zinc-300 text-zinc-600 rounded-2xl flex items-center font-bold transition-all">
                                    <Send className="mr-2 text-indigo-500" size={18} /> Transmit via Email
                                </button>
                            </div>
                            <p className="text-[10px] text-zinc-300 font-black tracking-[0.2em] uppercase italic">Precise Financials // Averqon</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Create/Edit Modal */}
            {(isCreating || editingInvoice) && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-in fade-in duration-300">
                    <div className="bg-zinc-900 w-full max-w-2xl rounded-[40px] p-10 border border-white/5 relative shadow-2xl">
                        <button onClick={() => { setIsCreating(false); setEditingInvoice(null); resetForm(); }} className="absolute right-8 top-8 text-gray-500 hover:text-white transition-colors">
                            <X size={24} />
                        </button>

                        {status === 'success' ? (
                            <div className="text-center py-12">
                                <div className="w-24 h-24 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                                    <CheckCircle size={48} />
                                </div>
                                <h2 className="text-4xl font-black mb-2">Operation Success!</h2>
                                <p className="text-gray-400 font-medium">The financial crypt has been updated in realtime.</p>
                            </div>
                        ) : (
                            <>
                                <h2 className="text-3xl font-black mb-8 flex items-center tracking-tighter">
                                    {editingInvoice ? 'MODIFY RECORD' : 'AUTHORIZE INVOICE'}
                                </h2>
                                <form onSubmit={editingInvoice ? handleEdit : handleCreate} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em]">Target Client</label>
                                            <input required value={newInvoice.client} onChange={e => setNewInvoice({ ...newInvoice, client: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-indigo-500 focus:outline-none transition-all placeholder:text-gray-700 font-bold" placeholder="Universal Dynamics" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em]">Email Address</label>
                                            <input type="email" value={newInvoice.email} onChange={e => setNewInvoice({ ...newInvoice, email: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-indigo-500 focus:outline-none transition-all placeholder:text-gray-700 font-bold" placeholder="hq@global.com" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em]">Service Description</label>
                                        <input value={newInvoice.description} onChange={e => setNewInvoice({ ...newInvoice, description: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-indigo-500 focus:outline-none transition-all placeholder:text-gray-700 font-bold" placeholder="Strategic Digital Transformation" />
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em]">Liquid Capital (₹)</label>
                                            <input required type="number" value={newInvoice.amount} onChange={e => setNewInvoice({ ...newInvoice, amount: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-indigo-500 focus:outline-none transition-all placeholder:text-gray-700 font-bold" placeholder="500000" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em]">Billing Date</label>
                                            <input required type="date" value={newInvoice.date} onChange={e => setNewInvoice({ ...newInvoice, date: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-indigo-500 focus:outline-none transition-colors font-bold" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em]">Filing Status</label>
                                        <select value={newInvoice.status} onChange={e => setNewInvoice({ ...newInvoice, status: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-indigo-500 focus:outline-none font-bold">
                                            <option className="bg-zinc-900" value="Pending">Pending Validation</option>
                                            <option className="bg-zinc-900" value="Paid">Processed (Paid)</option>
                                            <option className="bg-zinc-900" value="Overdue">Overdue Clearance</option>
                                        </select>
                                    </div>

                                    <button disabled={status === 'submitting'} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-5 rounded-3xl transition-all shadow-2xl shadow-indigo-500/30 flex items-center justify-center disabled:opacity-50 text-xl tracking-tighter">
                                        {status === 'submitting' ? 'SYNCHRONIZING...' : editingInvoice ? 'LEGALIZE CHANGES' : 'EXECUTE AUTHORIZATION'}
                                        <CheckCircle className="ml-3" size={24} />
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Invoices;

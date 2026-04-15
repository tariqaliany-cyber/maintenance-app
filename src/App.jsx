import { useState, useRef } from 'react'
import SignatureCanvas from 'react-signature-canvas'
import { jsPDF } from 'jspdf'

// ── English work types (used as internal keys and in PDF always) ──────────────
const WORK_TYPES_EN = ['Preventive Maintenance (PM)', 'Corrective Maintenance (CM)', 'Inspection']

// ── Translations ──────────────────────────────────────────────────────────────
const T = {
  en: {
    dir: 'ltr',
    appTitle: 'Service Engineers Report',
    appSubtitle: 'Field Maintenance System',
    sectionReport: 'Report Details',
    sectionEquipment: 'Equipment Info',
    sectionWorkType: 'Work Type',
    sectionDescription: 'Work Description',
    sectionTime: 'Time on Site',
    sectionStatus: 'Job Status',
    sectionSignOff: 'Customer Sign-Off',
    sectionSignature: 'Customer Signature',
    reportNumber: 'Report Number',
    date: 'Date',
    customerName: 'Customer Name',
    customerNamePlaceholder: 'Enter customer name',
    locationSite: 'Location / Site',
    locationSitePlaceholder: 'e.g. North Plant, Site B',
    equipmentNumber: 'Equipment Number',
    equipmentNumberPlaceholder: 'e.g. EQ-20240001',
    hourMeter: 'Hour Meter Reading',
    hourMeterPlaceholder: 'e.g. 1250',
    workTypeHint: 'Select all that apply',
    descriptionPlaceholder: 'Describe the work carried out...',
    timeIn: 'Time In',
    timeOut: 'Time Out',
    complete: 'Complete',
    incomplete: 'Incomplete',
    incompleteReason: 'Reason for incomplete job',
    incompleteReasonPlaceholder: 'e.g. Awaiting spare parts — bearing ref. SKF 6205, ETA unknown. Cannot complete until parts arrive.',
    signatoryName: 'Signatory Name',
    signatoryNamePlaceholder: 'Full name of signing person',
    badgeNumber: 'Badge / Employee Number',
    badgeNumberPlaceholder: 'e.g. EMP-1234',
    signHint: 'Sign in the box below',
    clearBtn: 'Clear',
    saveSignatureBtn: 'Save Signature',
    resignBtn: 'Clear & Re-sign',
    signatureCaptured: 'Signature captured',
    generateBtn: 'Generate PDF Report',
    workTypes: WORK_TYPES_EN,
  },
  ar: {
    dir: 'rtl',
    appTitle: 'تقرير مهندسي الخدمة',
    appSubtitle: 'نظام الصيانة الميدانية',
    sectionReport: 'تفاصيل التقرير',
    sectionEquipment: 'معلومات المعدات',
    sectionWorkType: 'نوع العمل',
    sectionDescription: 'وصف العمل',
    sectionTime: 'وقت الموقع',
    sectionStatus: 'حالة العمل',
    sectionSignOff: 'توقيع العميل',
    sectionSignature: 'توقيع العميل',
    reportNumber: 'رقم التقرير',
    date: 'التاريخ',
    customerName: 'اسم العميل',
    customerNamePlaceholder: 'أدخل اسم العميل',
    locationSite: 'الموقع',
    locationSitePlaceholder: 'مثال: المصنع الشمالي، الموقع ب',
    equipmentNumber: 'رقم المعدة',
    equipmentNumberPlaceholder: 'مثال: EQ-20240001',
    hourMeter: 'قراءة عداد الساعات',
    hourMeterPlaceholder: 'مثال: 1250',
    workTypeHint: 'اختر كل ما ينطبق',
    descriptionPlaceholder: 'صف العمل المنجز...',
    timeIn: 'وقت الدخول',
    timeOut: 'وقت الخروج',
    complete: 'مكتمل',
    incomplete: 'غير مكتمل',
    incompleteReason: 'سبب عدم الاكتمال',
    incompleteReasonPlaceholder: 'مثال: في انتظار قطع الغيار — مرجع المحمل SKF 6205، موعد التسليم غير معروف.',
    signatoryName: 'اسم الموقّع',
    signatoryNamePlaceholder: 'الاسم الكامل للشخص الموقّع',
    badgeNumber: 'رقم الشارة / رقم الموظف',
    badgeNumberPlaceholder: 'مثال: EMP-1234',
    signHint: 'وقّع في المربع أدناه',
    clearBtn: 'مسح',
    saveSignatureBtn: 'حفظ التوقيع',
    resignBtn: 'مسح وإعادة التوقيع',
    signatureCaptured: 'تم التقاط التوقيع',
    generateBtn: 'إنشاء تقرير PDF',
    workTypes: ['الصيانة الوقائية (PM)', 'الصيانة التصحيحية (CM)', 'التفتيش'],
  },
  tl: {
    dir: 'ltr',
    appTitle: 'Ulat ng Service Engineer',
    appSubtitle: 'Sistema ng Field Maintenance',
    sectionReport: 'Mga Detalye ng Ulat',
    sectionEquipment: 'Impormasyon ng Kagamitan',
    sectionWorkType: 'Uri ng Trabaho',
    sectionDescription: 'Paglalarawan ng Trabaho',
    sectionTime: 'Oras sa Site',
    sectionStatus: 'Katayuan ng Trabaho',
    sectionSignOff: 'Sign-Off ng Customer',
    sectionSignature: 'Pirma ng Customer',
    reportNumber: 'Numero ng Ulat',
    date: 'Petsa',
    customerName: 'Pangalan ng Customer',
    customerNamePlaceholder: 'Ilagay ang pangalan ng customer',
    locationSite: 'Lokasyon / Site',
    locationSitePlaceholder: 'hal. North Plant, Site B',
    equipmentNumber: 'Numero ng Kagamitan',
    equipmentNumberPlaceholder: 'hal. EQ-20240001',
    hourMeter: 'Pagbabasa ng Hour Meter',
    hourMeterPlaceholder: 'hal. 1250',
    workTypeHint: 'Piliin ang lahat ng naaangkop',
    descriptionPlaceholder: 'Ilarawan ang trabahong isinagawa...',
    timeIn: 'Oras ng Pasok',
    timeOut: 'Oras ng Labas',
    complete: 'Kumpleto',
    incomplete: 'Hindi Kumpleto',
    incompleteReason: 'Dahilan ng hindi pagkumpleto',
    incompleteReasonPlaceholder: 'hal. Naghihintay ng mga ekstrang bahagi — ref. SKF 6205, hindi pa alam ang ETA.',
    signatoryName: 'Pangalan ng Pumirma',
    signatoryNamePlaceholder: 'Buong pangalan ng pumipirma',
    badgeNumber: 'Numero ng Badge / Empleyado',
    badgeNumberPlaceholder: 'hal. EMP-1234',
    signHint: 'Pumirma sa kahon sa ibaba',
    clearBtn: 'I-clear',
    saveSignatureBtn: 'I-save ang Pirma',
    resignBtn: 'I-clear at Muling Pumirma',
    signatureCaptured: 'Nakuha ang pirma',
    generateBtn: 'Bumuo ng PDF na Ulat',
    workTypes: ['Preventive Maintenance (PM)', 'Corrective Maintenance (CM)', 'Inspeksyon'],
  },
  hi: {
    dir: 'ltr',
    appTitle: 'सेवा इंजीनियर रिपोर्ट',
    appSubtitle: 'फील्ड मेंटेनेंस सिस्टम',
    sectionReport: 'रिपोर्ट विवरण',
    sectionEquipment: 'उपकरण जानकारी',
    sectionWorkType: 'कार्य प्रकार',
    sectionDescription: 'कार्य विवरण',
    sectionTime: 'साइट पर समय',
    sectionStatus: 'कार्य स्थिति',
    sectionSignOff: 'ग्राहक साइन-ऑफ',
    sectionSignature: 'ग्राहक हस्ताक्षर',
    reportNumber: 'रिपोर्ट संख्या',
    date: 'दिनांक',
    customerName: 'ग्राहक का नाम',
    customerNamePlaceholder: 'ग्राहक का नाम दर्ज करें',
    locationSite: 'स्थान / साइट',
    locationSitePlaceholder: 'उदा. उत्तर संयंत्र, साइट बी',
    equipmentNumber: 'उपकरण संख्या',
    equipmentNumberPlaceholder: 'उदा. EQ-20240001',
    hourMeter: 'घंटा मीटर रीडिंग',
    hourMeterPlaceholder: 'उदा. 1250',
    workTypeHint: 'सभी लागू विकल्प चुनें',
    descriptionPlaceholder: 'किए गए कार्य का वर्णन करें...',
    timeIn: 'प्रवेश समय',
    timeOut: 'निकास समय',
    complete: 'पूर्ण',
    incomplete: 'अपूर्ण',
    incompleteReason: 'अधूरे काम का कारण',
    incompleteReasonPlaceholder: 'उदा. स्पेयर पार्ट्स का इंतजार है — बेयरिंग ref. SKF 6205, ETA अज्ञात।',
    signatoryName: 'हस्ताक्षरकर्ता का नाम',
    signatoryNamePlaceholder: 'हस्ताक्षर करने वाले का पूरा नाम',
    badgeNumber: 'बैज / कर्मचारी संख्या',
    badgeNumberPlaceholder: 'उदा. EMP-1234',
    signHint: 'नीचे बॉक्स में हस्ताक्षर करें',
    clearBtn: 'साफ़ करें',
    saveSignatureBtn: 'हस्ताक्षर सहेजें',
    resignBtn: 'साफ़ करें और फिर से हस्ताक्षर करें',
    signatureCaptured: 'हस्ताक्षर कैप्चर हो गया',
    generateBtn: 'PDF रिपोर्ट बनाएं',
    workTypes: ['Preventive Maintenance (PM)', 'Corrective Maintenance (CM)', 'निरीक्षण'],
  },
}

const LANGUAGES = [
  { code: 'en', label: 'EN' },
  { code: 'ar', label: 'AR' },
  { code: 'tl', label: 'TL' },
  { code: 'hi', label: 'हि' },
]

function generateReportNumber() {
  const date = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  return `RPT-${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}-${Math.floor(Math.random() * 9000) + 1000}`
}

const today = new Date().toISOString().split('T')[0]

const initialForm = {
  reportNumber: generateReportNumber(),
  date: today,
  customerName: '',
  locationSite: '',
  equipmentNumber: '',
  hourMeterReading: '',
  workTypes: [],
  description: '',
  timeIn: '',
  timeOut: '',
  jobStatus: '',
  incompleteReason: '',
  signatoryName: '',
  badgeNumber: '',
}

export default function App() {
  const [form, setForm] = useState(initialForm)
  const [signatureSaved, setSignatureSaved] = useState(false)
  const [signatureData, setSignatureData] = useState(null)
  const [lang, setLang] = useState('en')
  const sigCanvasRef = useRef(null)

  const t = T[lang]

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  // workTypes state always stores English strings as keys
  function toggleWorkType(enType) {
    setForm((prev) => ({
      ...prev,
      workTypes: prev.workTypes.includes(enType)
        ? prev.workTypes.filter((t) => t !== enType)
        : [...prev.workTypes, enType],
    }))
  }

  function handleClearSignature() {
    sigCanvasRef.current.clear()
    setSignatureSaved(false)
    setSignatureData(null)
  }

  function handleSaveSignature() {
    if (sigCanvasRef.current.isEmpty()) {
      alert('Please draw a signature first.')
      return
    }
    // Composite onto a white background so jsPDF renders it correctly
    const trimmed = sigCanvasRef.current.getTrimmedCanvas()
    const flat = document.createElement('canvas')
    flat.width = trimmed.width
    flat.height = trimmed.height
    const ctx = flat.getContext('2d')
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, flat.width, flat.height)
    ctx.drawImage(trimmed, 0, 0)
    setSignatureData(flat.toDataURL('image/png'))
    setSignatureSaved(true)
  }

  // ── PDF always uses English ────────────────────────────────────────────────
  function generatePDF() {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
    const pageW = 210
    const margin = 15
    const colW = pageW - margin * 2
    let y = 0

    const hex = (h) => [
      parseInt(h.slice(1, 3), 16),
      parseInt(h.slice(3, 5), 16),
      parseInt(h.slice(5, 7), 16),
    ]
    const BLUE   = hex('#1d4ed8')
    const LBLUE  = hex('#eff6ff')
    const GRAY   = hex('#6b7280')
    const LGRAY  = hex('#f3f4f6')
    const BLACK  = hex('#111827')
    const GREEN  = hex('#16a34a')
    const BORDER = hex('#d1d5db')

    const setFont = (style = 'normal', size = 10, color = BLACK) => {
      doc.setFont('helvetica', style)
      doc.setFontSize(size)
      doc.setTextColor(...color)
    }
    const line = (x1, yPos, x2, color = BORDER, w = 0.3) => {
      doc.setDrawColor(...color)
      doc.setLineWidth(w)
      doc.line(x1, yPos, x2, yPos)
    }
    const rect = (x, yPos, w, h, fill, stroke = null) => {
      doc.setFillColor(...fill)
      if (stroke) doc.setDrawColor(...stroke); else doc.setDrawColor(...fill)
      doc.roundedRect(x, yPos, w, h, 2, 2, stroke ? 'FD' : 'F')
    }
    const field = (label, value, x, yPos) => {
      setFont('bold', 7.5, GRAY)
      doc.text(label.toUpperCase(), x, yPos)
      setFont('normal', 10, BLACK)
      doc.text(value || '—', x, yPos + 5.5)
    }

    // Header banner
    doc.setFillColor(...BLUE)
    doc.rect(0, 0, pageW, 28, 'F')
    setFont('bold', 16, [255, 255, 255])
    doc.text('SERVICE ENGINEERS REPORT', margin, 12)
    setFont('normal', 8.5, [186, 210, 255])
    doc.text('Field Maintenance Management System', margin, 18.5)
    setFont('bold', 7, [186, 210, 255])
    doc.text('REPORT NO.', pageW - margin - 2, 10, { align: 'right' })
    setFont('bold', 9, [255, 255, 255])
    doc.text(form.reportNumber, pageW - margin - 2, 16.5, { align: 'right' })

    y = 34

    // Report Details
    rect(margin, y, colW, 30, LBLUE, BORDER)
    field('Date', form.date, margin + 4, y + 7)
    field('Customer Name', form.customerName, margin + 4 + 65, y + 7)
    field('Location / Site', form.locationSite, margin + 4, y + 20)
    y += 34

    // Equipment Info
    setFont('bold', 9, BLUE)
    doc.text('EQUIPMENT INFORMATION', margin, y + 5)
    line(margin, y + 7, margin + colW, BLUE, 0.4)
    y += 10
    rect(margin, y, colW, 28, LGRAY)
    field('Equipment Number', form.equipmentNumber, margin + 4, y + 6)
    field('Hour Meter Reading', form.hourMeterReading ? `${form.hourMeterReading} hrs` : '—', margin + 4, y + 19)
    y += 32

    // Work Type
    setFont('bold', 9, BLUE)
    doc.text('WORK TYPE', margin, y + 5)
    line(margin, y + 7, margin + colW, BLUE, 0.4)
    y += 10
    const chipW = 56
    const chipH = 9
    const chipGap = 4
    WORK_TYPES_EN.forEach((type, i) => {
      const active = form.workTypes.includes(type)
      const cx = margin + i * (chipW + chipGap)
      rect(cx, y, chipW, chipH, active ? BLUE : LGRAY, active ? BLUE : BORDER)
      setFont(active ? 'bold' : 'normal', 7.5, active ? [255, 255, 255] : GRAY)
      doc.text(type, cx + chipW / 2, y + 6, { align: 'center' })
    })
    y += 14

    // Work Description
    setFont('bold', 9, BLUE)
    doc.text('WORK DESCRIPTION', margin, y + 5)
    line(margin, y + 7, margin + colW, BLUE, 0.4)
    y += 10
    const descLines = doc.splitTextToSize(form.description || '—', colW - 8)
    const descBoxH = Math.max(20, descLines.length * 5 + 8)
    rect(margin, y, colW, descBoxH, LGRAY, BORDER)
    setFont('normal', 9.5, BLACK)
    doc.text(descLines, margin + 4, y + 7)
    y += descBoxH + 4

    // Time on Site
    setFont('bold', 9, BLUE)
    doc.text('TIME ON SITE', margin, y + 5)
    line(margin, y + 7, margin + colW, BLUE, 0.4)
    y += 10
    rect(margin, y, colW, 18, LGRAY)
    field('Time In', form.timeIn || '—', margin + 4, y + 6)
    field('Time Out', form.timeOut || '—', margin + 4 + 90, y + 6)
    y += 22

    // Job Status
    setFont('bold', 9, BLUE)
    doc.text('JOB STATUS', margin, y + 5)
    line(margin, y + 7, margin + colW, BLUE, 0.4)
    y += 10
    const isComplete = form.jobStatus === 'Complete'
    const isIncomplete = form.jobStatus === 'Incomplete'
    const statusColor = isComplete ? GREEN : isIncomplete ? hex('#dc2626') : GRAY
    const statusBg = isComplete ? [240, 253, 244] : isIncomplete ? [254, 242, 242] : LGRAY
    rect(margin, y, colW, isIncomplete && form.incompleteReason ? 28 : 16, statusBg, statusColor)
    setFont('bold', 10, statusColor)
    doc.text(form.jobStatus || 'Not specified', margin + 4, y + 10)
    if (isIncomplete && form.incompleteReason) {
      setFont('bold', 7.5, hex('#dc2626'))
      doc.text('REASON:', margin + 4, y + 20)
      setFont('normal', 8.5, BLACK)
      const reasonLines = doc.splitTextToSize(form.incompleteReason, colW - 28)
      doc.text(reasonLines[0] || '', margin + 22, y + 20)
    }
    y += (isIncomplete && form.incompleteReason ? 28 : 16) + 6

    // Customer Sign-Off
    setFont('bold', 9, BLUE)
    doc.text('CUSTOMER SIGN-OFF', margin, y + 5)
    line(margin, y + 7, margin + colW, BLUE, 0.4)
    y += 10
    rect(margin, y, colW, 18, LGRAY)
    field('Signatory Name', form.signatoryName, margin + 4, y + 6)
    field('Badge / Employee No.', form.badgeNumber, margin + 4 + 90, y + 6)
    y += 22

    // Signature
    setFont('bold', 9, BLUE)
    doc.text('CUSTOMER SIGNATURE', margin, y + 5)
    line(margin, y + 7, margin + colW, BLUE, 0.4)
    y += 10
    const sigBoxH = 40
    rect(margin, y, colW, sigBoxH, [255, 255, 255], BORDER)
    if (signatureData) {
      doc.addImage(signatureData, 'PNG', margin + 2, y + 2, colW - 4, sigBoxH - 4)
      rect(margin + 2, y + sigBoxH - 9, 36, 7, [240, 253, 244], GREEN)
      setFont('bold', 7, GREEN)
      doc.text('✓  SIGNATURE CAPTURED', margin + 5, y + sigBoxH - 4.5)
    } else {
      setFont('normal', 9, GRAY)
      doc.text('No signature provided', margin + colW / 2, y + sigBoxH / 2 + 1, { align: 'center' })
    }
    y += sigBoxH + 6

    // Footer
    const footerY = 287
    line(margin, footerY - 4, pageW - margin, BORDER)
    setFont('normal', 7.5, GRAY)
    doc.text(`Generated: ${new Date().toLocaleString()}`, margin, footerY)
    doc.text('Field Maintenance System', pageW - margin, footerY, { align: 'right' })

    doc.save(`Report_${form.reportNumber}.pdf`)
  }

  function handleSubmit(e) {
    e.preventDefault()
    generatePDF()
  }

  return (
    <div dir={t.dir} className="min-h-screen bg-gray-100">

      {/* Top Bar */}
      <div className="bg-blue-700 text-white px-4 py-4 sticky top-0 z-10 shadow-md">
        <div className="max-w-lg mx-auto flex items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold tracking-wide">{t.appTitle}</h1>
            <p className="text-blue-200 text-sm mt-0.5">{t.appSubtitle}</p>
          </div>
          {/* Language toggle */}
          <div className="flex gap-1 flex-shrink-0 mt-1">
            {LANGUAGES.map(({ code, label }) => (
              <button
                key={code}
                type="button"
                onClick={() => setLang(code)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  lang === code
                    ? 'bg-white text-blue-700'
                    : 'bg-blue-600 text-blue-100 hover:bg-blue-500'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-lg mx-auto px-4 py-6 space-y-6">

        {/* ── Report Details ── */}
        <Section title={t.sectionReport}>
          <Field label={t.reportNumber}>
            <input
              type="text"
              name="reportNumber"
              value={form.reportNumber}
              readOnly
              className="input bg-gray-100 text-gray-500 cursor-not-allowed"
            />
          </Field>
          <Field label={t.date}>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="input"
            />
          </Field>
          <Field label={t.customerName}>
            <input
              type="text"
              name="customerName"
              value={form.customerName}
              onChange={handleChange}
              placeholder={t.customerNamePlaceholder}
              className="input"
            />
          </Field>
          <Field label={t.locationSite}>
            <input
              type="text"
              name="locationSite"
              value={form.locationSite}
              onChange={handleChange}
              placeholder={t.locationSitePlaceholder}
              className="input"
            />
          </Field>
        </Section>

        {/* ── Equipment Info ── */}
        <Section title={t.sectionEquipment}>
          <Field label={t.equipmentNumber}>
            <input
              type="text"
              name="equipmentNumber"
              value={form.equipmentNumber}
              onChange={handleChange}
              placeholder={t.equipmentNumberPlaceholder}
              className="input"
            />
          </Field>
          <Field label={t.hourMeter}>
            <input
              type="number"
              name="hourMeterReading"
              value={form.hourMeterReading}
              onChange={handleChange}
              placeholder={t.hourMeterPlaceholder}
              className="input"
            />
          </Field>
        </Section>

        {/* ── Work Type ── */}
        <Section title={t.sectionWorkType}>
          <p className="text-sm text-gray-500 mb-3">{t.workTypeHint}</p>
          <div className="grid grid-cols-1 gap-3">
            {WORK_TYPES_EN.map((enType, i) => {
              const active = form.workTypes.includes(enType)
              return (
                <button
                  key={enType}
                  type="button"
                  onClick={() => toggleWorkType(enType)}
                  className={`py-3 px-4 rounded-xl border-2 text-sm font-semibold transition-all active:scale-95 text-start ${
                    active
                      ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                      : 'bg-white border-gray-300 text-gray-700'
                  }`}
                >
                  {active && <span className="mr-2">✓</span>}
                  {t.workTypes[i]}
                </button>
              )
            })}
          </div>
        </Section>

        {/* ── Work Description ── */}
        <Section title={t.sectionDescription}>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder={t.descriptionPlaceholder}
            rows={5}
            className="input resize-none"
          />
        </Section>

        {/* ── Time on Site ── */}
        <Section title={t.sectionTime}>
          <div className="grid grid-cols-2 gap-4">
            <Field label={t.timeIn}>
              <input
                type="time"
                name="timeIn"
                value={form.timeIn}
                onChange={handleChange}
                className="input"
              />
            </Field>
            <Field label={t.timeOut}>
              <input
                type="time"
                name="timeOut"
                value={form.timeOut}
                onChange={handleChange}
                className="input"
              />
            </Field>
          </div>
        </Section>

        {/* ── Job Status ── */}
        <Section title={t.sectionStatus}>
          <div className="grid grid-cols-2 gap-3">
            {['Complete', 'Incomplete'].map((status) => {
              const active = form.jobStatus === status
              const isComplete = status === 'Complete'
              const label = isComplete ? t.complete : t.incomplete
              return (
                <button
                  key={status}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, jobStatus: status, incompleteReason: '' }))}
                  className={`py-4 rounded-xl border-2 text-base font-bold transition-all active:scale-95 ${
                    active
                      ? isComplete
                        ? 'bg-green-600 border-green-600 text-white shadow-md'
                        : 'bg-red-500 border-red-500 text-white shadow-md'
                      : 'bg-white border-gray-300 text-gray-700'
                  }`}
                >
                  {active && <span className="mr-1">✓</span>}
                  {label}
                </button>
              )
            })}
          </div>
          {form.jobStatus === 'Incomplete' && (
            <div className="space-y-2 mt-1">
              <label className="block text-sm font-semibold text-red-600">
                {t.incompleteReason}
              </label>
              <textarea
                name="incompleteReason"
                value={form.incompleteReason}
                onChange={handleChange}
                placeholder={t.incompleteReasonPlaceholder}
                rows={4}
                className="input resize-none border-red-300 focus:ring-red-400"
              />
            </div>
          )}
        </Section>

        {/* ── Customer Sign-Off ── */}
        <Section title={t.sectionSignOff}>
          <Field label={t.signatoryName}>
            <input
              type="text"
              name="signatoryName"
              value={form.signatoryName}
              onChange={handleChange}
              placeholder={t.signatoryNamePlaceholder}
              className="input"
            />
          </Field>
          <Field label={t.badgeNumber}>
            <input
              type="text"
              name="badgeNumber"
              value={form.badgeNumber}
              onChange={handleChange}
              placeholder={t.badgeNumberPlaceholder}
              className="input"
            />
          </Field>
        </Section>

        {/* ── Customer Signature ── */}
        <Section title={t.sectionSignature}>
          {signatureSaved ? (
            <div className="space-y-3">
              <div className="border-2 border-green-400 rounded-xl overflow-hidden bg-white">
                <img
                  src={signatureData}
                  alt="Saved signature"
                  className="w-full h-36 object-contain p-2"
                />
              </div>
              <div className="flex items-center gap-2 text-green-600 text-sm font-semibold">
                <span>&#10003;</span>
                <span>{t.signatureCaptured}</span>
              </div>
              <button
                type="button"
                onClick={handleClearSignature}
                className="w-full py-3 rounded-xl border-2 border-red-400 text-red-500 font-semibold text-sm active:scale-95 transition-all"
              >
                {t.resignBtn}
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-gray-500">{t.signHint}</p>
              <div className="border-2 border-gray-300 rounded-xl overflow-hidden bg-white touch-none">
                <SignatureCanvas
                  ref={sigCanvasRef}
                  penColor="#1e3a5f"
                  canvasProps={{
                    className: 'w-full',
                    style: { height: '160px', display: 'block' },
                  }}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleClearSignature}
                  className="py-3 rounded-xl border-2 border-gray-300 text-gray-600 font-semibold text-sm active:scale-95 transition-all"
                >
                  {t.clearBtn}
                </button>
                <button
                  type="button"
                  onClick={handleSaveSignature}
                  className="py-3 rounded-xl bg-blue-600 text-white font-semibold text-sm active:scale-95 transition-all shadow-md"
                >
                  {t.saveSignatureBtn}
                </button>
              </div>
            </div>
          )}
        </Section>

        <button
          type="submit"
          className="w-full bg-blue-700 hover:bg-blue-800 active:scale-95 text-white text-lg font-bold py-4 rounded-2xl shadow-lg transition-all"
        >
          {t.generateBtn}
        </button>

        <div className="h-6" />
      </form>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 space-y-4">
      <h2 className="text-base font-bold text-blue-700 uppercase tracking-wider border-b border-gray-100 pb-2">
        {title}
      </h2>
      {children}
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-semibold text-gray-600">{label}</label>
      {children}
    </div>
  )
}

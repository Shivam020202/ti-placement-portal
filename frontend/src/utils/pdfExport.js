import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import DOMPurify from 'dompurify';

export const exportToPDF = (formData) => {
  const doc = new jsPDF();
  let yPos = 20;

  // Helper function to add text and update position
  const addText = (text, size = 12, isBold = false) => {
    doc.setFontSize(size);
    if (isBold) doc.setFont(undefined, 'bold');
    doc.text(text, 20, yPos);
    yPos += size / 2 + 5;
    doc.setFont(undefined, 'normal');
  };

  // Add new page if needed
  const checkSpace = (needed) => {
    if (yPos + needed > 280) {
      doc.addPage();
      yPos = 20;
    }
  };

  // Helper function for better formatting
  const addSection = (title, content, options = {}) => {
    const { fontSize = 12, spacing = 5, indent = 0 } = options;
    
    checkSpace(30);
    doc.setFont(undefined, 'bold');
    doc.setFontSize(16);
    doc.text(title, 20, yPos);
    yPos += 10;

    doc.setFont(undefined, 'normal');
    doc.setFontSize(fontSize);

    if (Array.isArray(content)) {
      content.forEach((item, index) => {
        checkSpace(10);
        const text = typeof item === 'string' ? item : item.text;
        const bullet = item.bullet ? '• ' : '';
        doc.text(`${bullet}${text}`, 20 + indent, yPos);
        yPos += spacing;
      });
    } else {
      const lines = doc.splitTextToSize(content, 170);
      doc.text(lines, 20 + indent, yPos);
      yPos += lines.length * spacing;
    }
    yPos += 10;
  };

  // Company Header
  doc.setFillColor(220, 20, 60); // Red color
  doc.rect(0, 0, 210, 40, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.text(formData.title || 'Job Listing', 20, 25);
  doc.setFontSize(12);
  doc.text(`Role: ${formData.role}`, 20, 35);
  
  // Reset text color
  doc.setTextColor(0, 0, 0);
  yPos = 50;

  // Job Description
  addSection('Job Description', DOMPurify.sanitize(formData.descriptionText || '', { ALLOWED_TAGS: [] }));

  // Requirements & Responsibilities
  addSection('Requirements', formData.requirements?.split('\n').filter(Boolean).map(req => ({
    text: req,
    bullet: true
  })), { indent: 5 });

  addSection('Responsibilities', formData.responsibilities?.split('\n').filter(Boolean).map(resp => ({
    text: resp,
    bullet: true
  })), { indent: 5 });

  // Eligibility Criteria
  addSection('Eligibility Criteria', [
    { text: 'Branch-wise CGPA Requirements:', bullet: false },
    ...Object.entries(formData.branchWiseMinCgpa).map(([branch, cgpa]) => ({
      text: `${branch}: ${cgpa} CGPA`,
      bullet: true
    })),
    { text: formData.activeBacklogsAcceptable ? 'Active Backlogs Allowed' : 'No Active Backlogs', bullet: true },
    { text: `Max Failed Subjects: ${formData.failedSubjects}`, bullet: true },
    ...(formData.bondInYrs > 0 ? [{ text: `${formData.bondInYrs} Year Bond`, bullet: true }] : [])
  ]);

  addSection('Application Deadline', new Date(formData.applicationDeadline).toLocaleString());

  // Location & Compensation
  addSection('Location & Compensation', [
    { text: 'Work Locations:', bullet: false },
    { text: formData.locationOptions?.join(', '), bullet: true },
    ...(formData.remoteWork ? [{ text: 'Remote work available', bullet: true }] : [])
  ]);

  addSection('Compensation', `₹${formData.ctc?.toLocaleString()} per annum`, { fontSize: 14 });

  if (formData.ctcBreakup?.length > 0) {
    addSection('CTC Breakdown', formData.ctcBreakup.map(component => ({
      text: `${component.name}: ₹${component.amount?.toLocaleString()}`,
      bullet: true
    })));
  }

  // Hiring Process
  addSection('Hiring Process', formData.workflowData?.map((process, index) => ({
    text: `${index + 1}. ${process.title}\nType: ${process.type.replace('_', ' ')}\nVenue: ${process.venue}\nDate: ${new Date(process.date.from).toLocaleString()} - ${new Date(process.date.to).toLocaleString()}${process.interviewType ? `\nInterview Type: ${process.interviewType}` : ''}${process.topic ? `\nTopic: ${process.topic}` : ''}${process.link ? `\nLink: ${process.link}` : ''}`,
    bullet: false
  })));

  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for(let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width - 30, doc.internal.pageSize.height - 10);
  }

  // Save the PDF
  doc.save(`${formData.title || 'job-listing'}.pdf`);
};

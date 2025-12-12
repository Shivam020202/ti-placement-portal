import { Document, Packer, Paragraph, TextRun, HeadingLevel, IBulletedList } from 'docx';
import DOMPurify from 'dompurify';

export const exportToWord = async (formData, format = 'docx') => {
  const children = [
    new Paragraph({
      text: formData.title || 'Job Listing',
      heading: HeadingLevel.HEADING_1,
    }),
    new Paragraph({
      children: [
        new TextRun({ text: `Role: ${formData.role}`, break: 1 }),
        new TextRun({ text: `Batch: ${formData.gradYear}`, break: 1 }),
      ],
    }),
    new Paragraph({ text: '', break: 1 })
  ];

  // Description
  if (formData.descriptionText) {
    children.push(
      new Paragraph({
        text: 'Job Description',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 400 }
      }),
      new Paragraph({
        text: DOMPurify.sanitize(formData.descriptionText, { ALLOWED_TAGS: [] }),
        spacing: { before: 200 }
      })
    );
  }

  // Requirements
  if (formData.requirements) {
    children.push(
      new Paragraph({
        text: 'Requirements',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 400 }
      })
    );

    formData.requirements.split('\n').filter(Boolean).forEach(req => {
      children.push(
        new Paragraph({
          text: req,
          bullet: {
            level: 0
          }
        })
      );
    });
  }

  // Responsibilities
  if (formData.responsibilities) {
    children.push(
      new Paragraph({
        text: 'Responsibilities',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 400 }
      })
    );

    formData.responsibilities.split('\n').filter(Boolean).forEach(resp => {
      children.push(
        new Paragraph({
          text: resp,
          bullet: {
            level: 0
          }
        })
      );
    });
  }

  const doc = new Document({
    sections: [{
      properties: {},
      children
    }]
  });

  // Generate and save file
  const blob = await Packer.toBlob(doc);
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${formData.title || 'job-listing'}.${format}`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};
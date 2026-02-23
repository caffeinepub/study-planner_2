export interface LetterParams {
  name: string;
  school: string;
  classGrade: string;
  dateDuration: string;
  reasonText: string;
}

export function generateLeaveApplicationLetter(params: LetterParams): string {
  const { name, school, classGrade, dateDuration, reasonText } = params;
  
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return `Date: ${today}

To,
The Principal/Class Teacher
${school}

Subject: Application for Leave

Respected Sir/Madam,

I am ${name}, a student of ${classGrade} in your esteemed institution. I am writing to request leave ${dateDuration}.

${reasonText}

I kindly request you to grant me leave for the mentioned period. I will ensure to complete all missed assignments and catch up with the coursework upon my return.

Thank you for your understanding and consideration.

Yours sincerely,
${name}
${classGrade}`;
}

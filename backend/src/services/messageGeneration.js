const OpenAI = require('openai');

/**
 * Message Generation Service using OpenAI
 * Generates personalized outreach messages
 */
class MessageGenerationService {
  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY;
    this.client = null;
    
    if (this.apiKey && this.apiKey !== 'your_openai_api_key_here') {
      this.client = new OpenAI({
        apiKey: this.apiKey
      });
    }
  }

  /**
   * Generate all three outreach messages
   * @param {Object} data - Contact and company data
   * @returns {Object} Three message types
   */
  async generateMessages(data) {
    const {
      contact,
      company,
      leadScore,
      triggers = []
    } = data;

    const email = await this.generateEmail(contact, company, triggers, leadScore);
    const linkedIn = await this.generateLinkedInMessage(contact, company, triggers);
    const followUp = await this.generateFollowUp(contact, company, triggers);

    return {
      email,
      linkedIn,
      followUp,
      generatedAt: new Date().toISOString()
    };
  }

  /**
   * Generate email message
   */
  async generateEmail(contact, company, triggers, leadScore) {
    const prompt = this.buildEmailPrompt(contact, company, triggers, leadScore);
    
    if (!this.client) {
      return this.mockEmail(contact, company, triggers);
    }

    try {
      const response = await this.client.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a professional sales email writer. Write concise, personalized, and compelling cold outreach emails. Keep them under 150 words.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      });

      return {
        subject: this.extractSubject(response.choices[0].message.content),
        body: response.choices[0].message.content,
        type: 'email'
      };
    } catch (error) {
      console.error('OpenAI API error:', error.message);
      return this.mockEmail(contact, company, triggers);
    }
  }

  /**
   * Generate LinkedIn message
   */
  async generateLinkedInMessage(contact, company, triggers) {
    const prompt = this.buildLinkedInPrompt(contact, company, triggers);
    
    if (!this.client) {
      return this.mockLinkedIn(contact, company);
    }

    try {
      const response = await this.client.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a professional LinkedIn outreach writer. Write brief, personalized connection messages. Keep them under 300 characters to fit LinkedIn limits.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 200
      });

      return {
        message: response.choices[0].message.content,
        type: 'linkedin'
      };
    } catch (error) {
      console.error('OpenAI API error:', error.message);
      return this.mockLinkedIn(contact, company);
    }
  }

  /**
   * Generate follow-up email
   */
  async generateFollowUp(contact, company, triggers) {
    const prompt = this.buildFollowUpPrompt(contact, company, triggers);
    
    if (!this.client) {
      return this.mockFollowUp(contact, company);
    }

    try {
      const response = await this.client.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a professional sales follow-up writer. Write brief, friendly follow-up emails that add value. Keep them under 100 words.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 400
      });

      return {
        subject: this.extractSubject(response.choices[0].message.content),
        body: response.choices[0].message.content,
        type: 'follow-up'
      };
    } catch (error) {
      console.error('OpenAI API error:', error.message);
      return this.mockFollowUp(contact, company);
    }
  }

  buildEmailPrompt(contact, company, triggers, leadScore) {
    return `Write a personalized cold email to ${contact.firstName} ${contact.lastName}, ${contact.title} at ${company.name}.

Company info: ${company.description || 'A growing company'}
Key triggers: ${triggers.join(', ') || 'expanding team'}
Lead score: ${leadScore?.total || 'N/A'}/100

Include a subject line on the first line starting with "Subject:", then the email body.
Focus on their recent ${triggers[0] || 'growth'} and how our solution can help.`;
  }

  buildLinkedInPrompt(contact, company, triggers) {
    return `Write a brief LinkedIn connection request message to ${contact.firstName} ${contact.lastName} at ${company.name}.
Mention their ${triggers[0] || 'company growth'} and express interest in connecting.
Maximum 300 characters including spaces.`;
  }

  buildFollowUpPrompt(contact, company, triggers) {
    return `Write a friendly follow-up email to ${contact.firstName} checking in after no response to initial outreach.
Reference ${company.name} and add value by mentioning a relevant insight about ${triggers[0] || 'their industry'}.
Include a subject line on the first line starting with "Subject:", then the email body.`;
  }

  extractSubject(content) {
    const subjectMatch = content.match(/Subject:\s*(.+?)(?:\n|$)/i);
    return subjectMatch ? subjectMatch[1].trim() : 'Quick question';
  }

  // Mock methods for demo
  mockEmail(contact, company, triggers) {
    return {
      subject: `Quick question about ${company.name}'s growth`,
      body: `Hi ${contact.firstName},

I noticed ${company.name} recently ${triggers[0] || 'expanded their team'} - congratulations on the growth!

I'm reaching out because we help companies like yours streamline their sales process and accelerate revenue growth. Given your current momentum, I thought this might be timely.

Would you be open to a quick 15-minute call next week to explore if there's a fit?

Best regards`,
      type: 'email'
    };
  }

  mockLinkedIn(contact, company) {
    return {
      message: `Hi ${contact.firstName}, I came across ${company.name} and was impressed by your recent growth. Would love to connect and learn more about what you're building!`,
      type: 'linkedin'
    };
  }

  mockFollowUp(contact, company) {
    return {
      subject: `Following up - ${company.name}`,
      body: `Hi ${contact.firstName},

Following up on my previous email about helping ${company.name} scale faster. I recently came across an insight about your industry that I thought you'd find valuable.

Would a brief call next week work to discuss?

Best`,
      type: 'follow-up'
    };
  }
}

module.exports = new MessageGenerationService();

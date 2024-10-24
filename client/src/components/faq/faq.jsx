import {useState} from 'react'
import { Container } from 'react-bootstrap'
import './faq.css'
const Faq = () => {
    const [openQuestion, setOpenQuestion] = useState(null);

  const toggleQuestion = (index) => {
    setOpenQuestion(openQuestion === index ? null : index);
  };

  const faqData = [
    {
      question: "What is this blogspot platform about?",
      answer: "Our blog platform allows users to read, write, and share blog posts on various topics, from technology to lifestyle."
    },
    {
      question: "How do I create an account?",
      answer: "You can create an account by clicking on the 'Regsiter' button on the homepage and filling in your details."
    },
    {
      question: "How do I write a blog post?",
      answer: "Once you're logged in, go to your upload blogs section. Fill in your blog details if you want to add the extra subheading and paragraph click the add subheading and paragraph button and click 'Publish.'"
    },
    {
      question: "Can I edit or delete my posts?",
      answer: "Yes! You can edit or delete your posts from your profile page by selecting the respective post and choosing the edit or delete option."
    },
    {
      question: "How do I contact support?",
      answer: "You can reach out to us via the 'Contact Us' page, or email us directly at abinandhan506@gmail.com."
    },
    {
      question: "Are there any restrictions on what I can post?",
      answer: "We encourage creativity, but we ask that you adhere to our content guidelines. Posts containing offensive language or inappropriate material will be removed."
    }
    ,
    {
      question:"Any other questions ?",
      answer:"Just contact us, by filling the form in the contact us section, and we'll be more than happy to help you."
    }
  ];

  return (
    <Container>
      <h1 className='faq-heading'>Have a Question? Look here</h1>
      <ul className="faq-lists">
        {faqData.map((item, index) => (
          <li key={index} className="faq-item">
            <details>
              <summary className="faq-question"><strong>{item.question}</strong></summary>
              <div className="faq-answer">{item.answer}</div>
            </details>
            <hr/>
          </li>
        ))}
      </ul>
    </Container>
  )
}

export default Faq

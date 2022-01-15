import React, { useState, useEffect } from "react";
import Axios from "axios";

//React Bootstrap components
import { Button, Form, Container, Card, Row, Col } from "react-bootstrap";
import UpdateModal from "./Modal";

import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const [faqList, setFaqList] = useState([]);

  //fetching data in database when document loads
  useEffect(async () => {
    await Axios.get("https://crud-solana.herokuapp.com/faqs")
      .then((response) => setFaqList(response.data))
      .catch((err) => console.log(err));
  }, []);

  //inserting faq
  const addFaq = (e) => {
    e.preventDefault();
    Axios.post("https://crud-solana.herokuapp.com/add", { question, answer })
      .then((response) =>
        setFaqList([
          ...faqList,
          {
            _id: response.data._id,
            question: question,
            answer: answer,
          },
        ])
      )
      .catch(() => console.log("it didn't work!"));

    //clearing out input fields after adding faq
    setQuestion("");
    setAnswer("");
  };

  //updating faq
  const saveUpdatedData = (data) => {
    //holding data to dynamically update on frontend
    const newQuestion = data.question;
    const newAnswer = data.answer;

    Axios.put(`https://crud-solana.herokuapp.com/update/${data.id}`, {
      newQuestion: data.question,
      newAnswer: data.answer,
      id: data.id,
    }).then(() => {
      setFaqList(
        faqList.map((faq) => {
          //checking if the faq Id from database is equal to the one we are updating
          return faq._id === data.id
            ? {
                _id: data.id,
                question: newQuestion,
                answer: newAnswer,
              }
            : faq;
        })
      );
    });
    console.log(data);
  };

  //delete faq
  const deleteFaq = (id) => {
    //simply delete with faq with it's id as params
    Axios.delete(`https://crud-solana.herokuapp.com/delete/${id}`).then(() => {
      setFaqList(
        //filter and show only faqs with ids which are not equal to clicked or id to delete
        faqList.filter((faq) => {
          return faq._id !== id;
        })
      );
    });
  };

  return (
    <Container className="app">
      <Container className="inputs">
        <h1>Your Faq List!</h1>
        <Form>
          <Form.Control
            onChange={(e) => setQuestion(e.target.value)}
            value={question}
            type="text"
            placeholder="Question"
            className="input"
          />

          <Form.Control
            onChange={(e) => setAnswer(e.target.value)}
            value={answer}
            type="text"
            placeholder="Answer"
            className="input"
          />

          <Button
            disabled={!question || !answer}
            size="lg"
            variant="outline-light"
            onClick={addFaq}
          >
            Add
          </Button>
        </Form>
      </Container>

      <Container className="friend-list">
        <Row className="justify-content-md-center">
          <h2>FAQs</h2>
          {faqList.map((faq) => {
            return (
              <Col xs={12} md={4}>
                <Card className="friend-card">
                  <Card.Body>
                    <Card.Title>{faq.question}</Card.Title>
                    <Card.Text>{faq.answer}</Card.Text>
                    {/* bootstrap cusotm modal component, getting data as a function params */}
                    <UpdateModal
                      id={faq._id}
                      onSaveUpdateData={saveUpdatedData}
                    />
                    <Button
                      onClick={() => deleteFaq(faq._id)}
                      className="friend-card-btn"
                      variant="outline-dark"
                      size="md"
                    >
                      Delete
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </Container>
  );
}

export default App;

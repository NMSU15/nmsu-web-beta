import { Head } from "@react-email/head";
import { Html, Body, Container, Section, Button, Img, Heading, Text, Row, Column, Hr } from "@react-email/components";

export function Mail() {
    return (
        <Html>
        <Head />
        <Body style={{ fontFamily: "sans-serif", margin: "auto"}}>
          <Container style={{ border: "1px solid #eaeaea", backgroundColor: "#ffffff", borderRadius: "8px", maxWidth: "465px", margin: "auto" }}>
            <Section style={{borderRadius: "8px 8px 0 0", backgroundColor: "#0f0f0f"}}>
              <Row style={{padding: "8px"}}>
                <Column style={{width: "72px"}}>
                  <Img
                    src={"https://i.imgur.com/M31Luby.png"}
                    width="64"
                    height="64"
                    alt="NMSU-logo"
                    style={{margin: "4px"}}
                  />
                </Column>
                <Column>
                  <Heading style={{ color: "#ffffff", fontSize: "16px", fontWeight: "normal", textAlign: "left", margin: "0 16px"}}>
                    <strong style={{lineHeight: "20px"}}>Шинэ Монгол<br/>Оюутны Холбоо</strong>
                  </Heading>
                </Column>
              </Row>
            </Section>
            <Section style={{padding: "20px"}}>
            <Text style={{ color: "#000000", fontSize: "18px", lineHeight: "24px", textAlign: "start", margin: "0"}}>
              <strong>Сайн уу?</strong>
            </Text>
            <Row>
                <Column>
                    <Text style={{ color: "#000000", fontSize: "16px", lineHeight: "24px", textAlign: "start" }}>
                        Оюутны Холбооны 2024-2025 оны хичээлийн жилийн шинэ элсэлтээ зарлаж байна. Эхний хэсэгт энэхүү формыг бөглөх бөгөөд хэрхэн бөглөснийг тань харгалзан дараагийн шатны ярилцлагын хугацааг имэйл хаягаар тань бид илгээн шинэ оюутнуудаа элсүүлэн авах болно.
                    </Text>
                </Column>
            </Row>
            <Row style={{padding: "12px 0"}}>
                <Column>
                    <Text style={{ color: "#000000", fontSize: "16px", lineHeight: "24px", margin: "0" }}>
                        Элсэх хүсэлт хүлээн авах сүүлийн хугацаа: 2024/10/17
                    </Text>
                </Column>
            </Row>
            <Row>
              <Column style={{textAlign: "center", padding: "16px 0"}}>
                <Button
                  style={{
                    backgroundColor: "#0f0f0f",
                    borderRadius: "4px",
                    color: "#ffffff",
                    fontSize: "16px",
                    fontWeight: "bold",
                    textDecoration: "none",
                    padding: "12px 24px"
                  }}
                  href="http://student.nmit.edu.mn/"
                >
                  Элсэх
                </Button>
              </Column>
            </Row>
            <Row style={{paddingTop: "12px"}}>
                <Column>
                    <Text style={{ color: "#000000", fontSize: "16px", lineHeight: "24px", margin: "0" }}>
                        Хүндэтгэсэн,
                        Шинэ Монгол Оюутны Холбоо
                    </Text>
                </Column>
              </Row>
            </Section>
            <Section style={{padding: "0 20px 20px 20px"}}>
            <Hr style={{ border: "1px solid #eaeaea", margin: "0 0 20px 0", width: "100%" }} />
            <Text style={{ color: "#666666", fontSize: "14px", lineHeight: "24px", textAlign: "center" }}>
              @NEW MONGOL STUDENT UNION
            </Text>
            </Section>
          </Container>
        </Body>
      </Html>
    );
}

import {
    Body,
    Button,
    Container,
    Column,
    Head,
    Heading,
    Hr,
    Html,
    Img,
    Link,
    Preview,
    Row,
    Section,
    Text,
    Tailwind,
  } from "@react-email/components";
  import * as React from "react";
  
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "";
  
  export const VercelInviteUserEmail = () => {

    const previewText = `Join aaa on Vercel`;
  
    return (
      <Html>
        <Head />
        <Preview>{previewText}</Preview>
        <Tailwind>
          <Body className="bg-white my-auto mx-auto font-sans px-2">
            <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
              <Section className="mt-[32px]">
                <Img
                  src={`https://i.imgur.com/Kgtw3x5.png`}
                  width="64"
                  height="64"
                  alt="Logo"
                  className="my-0 mx-auto"
                />
              </Section>
              <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
                Join <strong>aaa</strong> on <strong>Vercel</strong>
              </Heading>
              <Text className="text-black text-[14px] leading-[24px]">
                Hello aaa,
              </Text>
              <Text className="text-black text-[14px] leading-[24px]">
                <strong>aaa</strong> (
                <Link
                  href={`mailto:aaa`}
                  className="text-blue-600 no-underline"
                >
                  aaa
                </Link>
                ) has invited you to the <strong>aaa</strong> team on{" "}
                <strong>Vercel</strong>.
              </Text>
              <Section>
                <Row>
                  <Column align="right">
                    <Img
                      className="rounded-full"
                      src={"https://i.imgur.com/Kgtw3x5.png"}
                      width="64"
                      height="64"
                    />
                  </Column>
                  <Column align="center">
                    <Img
                      src={`https://i.imgur.com/Kgtw3x5.png`}
                      width="12"
                      height="9"
                      alt="invited you to"
                    />
                  </Column>
                  <Column align="left">
                    <Img
                      className="rounded-full"
                      src={"https://i.imgur.com/Kgtw3x5.png"}
                      width="64"
                      height="64"
                    />
                  </Column>
                </Row>
              </Section>
              <Section className="text-center mt-[32px] mb-[32px]">
                <Button
                  className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                  href="aaa"
                >
                  Join the team
                </Button>
              </Section>
              <Text className="text-black text-[14px] leading-[24px]">
                or copy and paste this URL into your browser:{" "}
                <Link href="aaa" className="text-blue-600 no-underline">
                  aaa
                </Link>
              </Text>
              <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
              <Text className="text-[#666666] text-[12px] leading-[24px]">
                This invitation was intended for{" "}
                <span className="text-black">aaa</span>. This invite was
                sent from <span className="text-black">aaa</span>{" "}
                located in{" "}
                <span className="text-black">aaa</span>. If you
                were not expecting this invitation, you can ignore this email. If
                you are concerned about your account's safety, please reply to
                this email to get in touch with us.
              </Text>
            </Container>
          </Body>
        </Tailwind>
      </Html>
    );
  };
  
  export default VercelInviteUserEmail;
  
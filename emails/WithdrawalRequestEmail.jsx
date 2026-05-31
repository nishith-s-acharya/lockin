import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Hr,
  Button,
} from "@react-email/components";

export function WithdrawalRequestEmail({
  interviewerName,
  interviewerEmail,
  credits,
  platformFee,
  netAmount,
  paymentMethod,
  paymentDetail,
  reviewUrl,
}) {
  return (
    <Html>
      <Head />
      <Body style={body}>
        <Container style={container}>
          <Text style={heading}>Withdrawal Request</Text>
          <Text style={paragraph}>
            <strong>{interviewerName}</strong> ({interviewerEmail}) has requested
            a withdrawal.
          </Text>

          <Section style={detailsBox}>
            <Text style={detailRow}>
              <strong>Credits:</strong> {credits}
            </Text>
            <Text style={detailRow}>
              <strong>Platform fee:</strong> ${platformFee?.toFixed(2)}
            </Text>
            <Text style={detailRow}>
              <strong>Net payout:</strong> ${netAmount?.toFixed(2)}
            </Text>
            <Hr style={hr} />
            <Text style={detailRow}>
              <strong>Method:</strong> {paymentMethod}
            </Text>
            <Text style={detailRow}>
              <strong>Details:</strong> {paymentDetail}
            </Text>
          </Section>

          {reviewUrl && (
            <Section style={{ textAlign: "center", marginTop: "24px" }}>
              <Button style={button} href={reviewUrl}>
                Review Payout
              </Button>
            </Section>
          )}
        </Container>
      </Body>
    </Html>
  );
}

const body = {
  backgroundColor: "#0a0a0b",
  fontFamily: "'DM Sans', Arial, sans-serif",
};

const container = {
  maxWidth: "480px",
  margin: "0 auto",
  padding: "40px 24px",
};

const heading = {
  fontSize: "22px",
  fontWeight: "600",
  color: "#e7e5e4",
  marginBottom: "16px",
};

const paragraph = {
  fontSize: "14px",
  lineHeight: "1.6",
  color: "#a8a29e",
};

const detailsBox = {
  backgroundColor: "#141417",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "12px",
  padding: "20px",
  marginTop: "16px",
};

const detailRow = {
  fontSize: "13px",
  color: "#d6d3d1",
  margin: "4px 0",
};

const hr = {
  borderColor: "rgba(255,255,255,0.08)",
  margin: "12px 0",
};

const button = {
  backgroundColor: "#f59e0b",
  color: "#0a0a0b",
  fontSize: "13px",
  fontWeight: "600",
  padding: "10px 24px",
  borderRadius: "8px",
  textDecoration: "none",
};

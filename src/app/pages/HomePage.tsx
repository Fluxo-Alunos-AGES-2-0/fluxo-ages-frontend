export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "2rem",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: "40rem",
          padding: "2rem",
          borderRadius: "1rem",
          backgroundColor: "#ffffff",
          boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
        }}
      >
        <h1 style={{ marginTop: 0 }}>Frontend resetado</h1>
        <p style={{ marginBottom: 0 }}>
          A estrutura base do React foi mantida para o grupo começar a implementar.
        </p>
      </section>
    </main>
  );
}

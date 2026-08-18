const testimonials = [
  {
    quote:
      'Sempre tive bloqueio com cálculo. Em 10 minutos visualizando derivadas, tudo fez sentido.',
    author: 'Luna A., estudante de engenharia',
  },
  {
    quote:
      'Consegui explicar seno e cosseno para minha turma usando o círculo interativo. Foi imediato.',
    author: 'Rafael M., monitor de matemática',
  },
  {
    quote: 'A parte de áudio transformou frequência em algo físico. Isso muda como a gente aprende.',
    author: 'Nina P., produtora musical',
  },
]

const TestimonialSection = () => {
  return (
    <section className="testimonial-section reveal" data-reveal>
      <header className="section-header">
        <p className="section-kicker">Depoimentos</p>
        <h2>"Eu nunca vi matemática assim."</h2>
      </header>

      <div className="testimonial-grid">
        {testimonials.map((item, index) => (
          <blockquote key={item.author} className="testimonial-card" data-reveal data-stagger={index}>
            <p>“{item.quote}”</p>
            <cite>{item.author}</cite>
          </blockquote>
        ))}
      </div>
    </section>
  )
}

export default TestimonialSection

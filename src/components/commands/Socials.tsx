const socials = [
  {
    id: 1,
    title: "GitHub",
    url: "https://github.com/sallysooo",
    username: "github.com/sallysooo",
    tab: 6
  },
  {
    id: 2,
    title: "Linkedin",
    url: "https://www.linkedin.com/in/jisoo-kim-66619b2bb/",
    username: "@jisoo-kim",
    tab: 4
  },
  {
    id: 4,
    title: "Instagram",
    url: "https://instagram.com/sallysooo",
    username: "@sallysooo",
    tab: 3
  },
  {
    id: 5,
    title: "Blog",
    url: "https://sallysooo.tistory.com/",
    username: "@여백::",
    tab: 8
  },
]

const Socials: React.FC = () => {

  const generateTabs = (count: number) => {
    return '\u00A0'.repeat(count)
  }
  return (
    <div>
      {socials.map(({ title, id, url, username, tab }) => (
        <div key={id} className="socials">
          <pre>
            <span>{title} </span> {generateTabs(tab)} ⬌ <span><a href={url} target="_blank"> {username}</a></span>
          </pre>
        </div>
      ))}
    </div>
  );
};

export default Socials

import Link from 'next/link'

export default function Home() {

  return (
    <>
      <div className='card'>

        <Link target={"_blank"} className='button-card' href="/api/feed.xml">
          XML API click here
        </Link>

        <Link target={"_blank"} className='button-card' href="/api/linkedin">
          Linkedin API click here
        </Link>
      </div>
    </>
  )
}

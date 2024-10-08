import Image from "next/image"

export const metadata = {
  title: 'thanks',
}

export default function Page() {
  return (
    <main>
        <div className="center">
        <div className="centerq">
            <Image
                src={"./Logo.svg"}
                width={100}
                height={100}
                alt="Logo"
                className="logo"
            />
          <h3 className="ttext">Таны илгээсэн хүсэлтийг бид хүлээн авлаа баярлалаа!</h3>
          </div>
        </div>
    </main>
  )
}

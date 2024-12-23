import Image from "next/image"
import Link from "next/link"

export default function Page() {
  return (
    <main>
        <div className="center">
        <div className="centerq">
            <Image
                src={"/Logo.svg"}
                width={100}
                height={100}
                alt="Logo"
                className="logo"
            />
          <h3 className="text3">Таны элсэх хүсэлтийг бид хүлээн авлаа баярлалаа!</h3>
          <p className="textp">
          Бид хүсэлтийг тань хүлээн авсны дараа эргүүлэн имэйлээр холбогдох тул та имэйлээ шалган хүлээн авсаанаа мэдэгдэн бидэнд буцаан хариу бичээрэй. Мөн асуух зүйл байвал бидний social хаягуудаар холбогдоорой.
          </p>
          <p className="textp social">
            <Link href="mailto:student_union@nmit.edu.mn">email: student_union@nmit.edu.mn</Link>
            <br/>
            <Link href="https://www.facebook.com/nmit.studentunion/">fb: Nmit StudentUnion</Link>
            <br/>
            <Link href="https://www.instagram.com/nmit_student_union/">ig: nmit_student_union</Link>
          </p>
          </div>
        </div>
    </main>
  )
}

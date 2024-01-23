import Image from "next/image";
import Link from "next/link";

export default function UserIds({
  username,
  user_image,
  given_name,
  family_name,
}) {
  return (
    <div className="flex flex-col justify-center items-start gap-4">
      <div className="flex flex-col justify-center items-center gap-8">
        <Link
          className="flex gap-4 items-center justify-center"
          href={`/profile/${username}`}
          
        >
          <Image
            src={user_image}
            alt="not found"
            height={200}
            width={210}
            quality={100}
            className="h-10 w-10 rounded-full object-cover"
          />
          <span className="flex items-start justify-center flex-col">
            <p className="text-lg">@{username}</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {given_name} {family_name}
            </p>
          </span>
        </Link>
      </div>
    </div>
  );
}

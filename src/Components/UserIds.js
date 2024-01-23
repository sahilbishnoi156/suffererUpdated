import Image from "next/image";
import Link from "next/link";

export default function UserIds({
  user,
}) {
  return (
    <div className="flex flex-col justify-center items-start gap-4">
      <div className="flex flex-col justify-center items-center gap-8">
        <Link
          className="flex gap-4 items-center justify-center"
          href={`/profile/${user?.username}`}
          
        >
          <Image
            src={user?.image}
            alt="not found"
            height={200}
            width={210}
            quality={100}
            className="h-10 w-10 rounded-full object-cover"
          />
          <span className="flex items-start justify-center flex-col text-black dark:text-white">
            <p className="text-lg flex items-center gap-2 font-medium">@{user?.username} {user?.isVerified && <img src="/verified.svg" className="h-4 w-4" />}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
            {user?.given_name} {user?.family_name}
            </p>
          </span>
        </Link>
      </div>
    </div>
  );
}

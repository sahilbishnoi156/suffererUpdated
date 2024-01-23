import React from "react";
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
} from "@nextui-org/react";
import { useUserStore } from "@/stateManagment/zustand";

export const UserM = ({ user }) => {
  const { currentUserData } = useUserStore();
  const [isFollowingLoading, setIsFollowingLoading ] = React.useState(false)
  const [followInfo, setFollowInfo] = React.useState({
    isFollowed: user?.followers?.some(
      (user) => user?._id === currentUserData?.user?._id
    ),
    number: user?.followers?.length
  });

  //* Follow Clicked
  const handleFollowUser = async () => {
    setIsFollowingLoading(true)
    try {
      const response = await fetch(`/api/user/follow`, {
        method: "PATCH",
        body: JSON.stringify({
          followedUserUsername: user?.username,
        }),
      });
      const data = await response.json();
      if (data.status !== 200) {
        throw new Error(data.message || "Something went wrong");
      }
      setFollowInfo((prev) => ({
          isFollowed: !prev?.isFollowed,
          number: prev?.isFollowed
            ? prev?.number - 1
            : prev?.number + 1,
      }));
      // Handle successful response, update state, etc.
    } catch (error) {
        setFollowInfo((prev) => ({
            isFollowed: !prev?.isFollowed,
            number: prev?.isFollowed
              ? prev?.number - 1
              : prev?.number + 1,
        }));
      console.log(error);
    } finally{
        setIsFollowingLoading(false)
    }
  };

  return (
    <Card shadow="none" className="min-w-[300px] max-w-[300px] border-none bg-transparent">
      <CardHeader className="justify-between">
        <div className="flex gap-3">
          <Avatar isBordered radius="full" size="md" src={user?.image} />
          <div className="flex flex-col items-start justify-center">
            <h4 className="text-small font-semibold leading-none text-default-600">
              {user?.given_name}
              {user?.family_name}
            </h4>
            <h5 className="text-small tracking-tight text-default-500">
              @{user?.username}
            </h5>
          </div>
        </div>
        {user?._id !== currentUserData?.user?._id && <Button
        isLoading={isFollowingLoading}
          className={
            followInfo?.isFollowed
              ? "bg-transparent text-foreground border-default-200"
              : ""
          }
          color="primary"
          radius="full"
          size="sm"
          variant={followInfo?.isFollowed ? "bordered" : "solid"}
          onPress={handleFollowUser}
        >
          {!isFollowingLoading && followInfo?.isFollowed ? "Unfollow" : "Follow"}
        </Button>}
      </CardHeader>
      <CardBody className="px-3 py-0">
        <p className="text-small pl-px text-default-500">{user?.about.slice(0,50)}</p>
      </CardBody>
      <CardFooter className="gap-3">
        <div className="flex gap-1">
          <p className="font-semibold text-default-600 text-small">
            {user?.followings?.length}
          </p>
          <p className=" text-default-500 text-small">Following</p>
        </div>
        <div className="flex gap-1">
          <p className="font-semibold text-default-600 text-small">
            {followInfo?.number || 0}
          </p>
          <p className="text-default-500 text-small">Followers</p>
        </div>
      </CardFooter>
    </Card>
  );
};

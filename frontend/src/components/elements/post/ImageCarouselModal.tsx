import { X } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const ImageCarouselModal = ({
  setImageCarouselModal,
  images,
}: {
  setImageCarouselModal: (e: boolean) => void;
  images: string[];
}) => {
  return (
    <div className="fixed top-0 left-0 w-screen h-screen bg-black/50 z-50 p-4">
      <div className="flex items-center justify-center h-full">
        <X
          className="text-red-500 hover:rotate-180 hover:scale-110 cursor-pointer absolute top-4 right-4 md:top-10 md:right-10"
          onClick={() => setImageCarouselModal(false)}
        />
        <div className="p-4 md:p-10 w-full max-w-5xl">
          <Carousel>
            <CarouselContent>
              {images.map((image: string, i: number) => {
                return (
                  <CarouselItem key={i} className="flex items-center justify-center">
                    <img src={image} className="w-full h-full object-cover" />
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export default ImageCarouselModal;

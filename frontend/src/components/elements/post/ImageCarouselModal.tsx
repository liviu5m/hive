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
    <div className="fixed top-0 left-0 w-screen h-screen bg-black/50 z-50">
      <div className="flex items-center justify-center h-screen">
        <X
          className="text-red-500 hover:rotate-180 hover:scale-110 cursor-pointer absolute top-10 right-10"
          onClick={() => setImageCarouselModal(false)}
        />
        <div className="p-20">
          <Carousel>
            <CarouselContent>
              {images.map((image: string, i: number) => {
                return (
                  <CarouselItem key={i} className="flex items-center justify-center">
                    <img src={image} />
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

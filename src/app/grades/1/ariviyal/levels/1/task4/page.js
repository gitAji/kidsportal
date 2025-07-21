import React from 'react';
import Image from 'next/image';

const PlantPartsPage = () => {
  const plantParts = ['Flower', 'Leaf', 'Stem', 'Root'];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Task 4: Parts of a Plant</h1>
      <p className="text-lg mb-4">Drag and drop the labels to the correct part of the plant.</p>
      <div className="flex justify-center items-center">
        <Image src="/images/plant_with_labels.png" alt="Plant with labels" width={384} height={384} className="object-contain" />
        <div className="flex flex-col space-y-4 ml-8">
          {plantParts.map((part, index) => (
            <div key={index} className="bg-gray-200 p-4 rounded-lg cursor-pointer text-center text-xl">
              {part}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlantPartsPage;
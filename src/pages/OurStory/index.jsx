import Wrapper from "../../components/wrapper";

const OurStoryPage = () => {
  return (
    <Wrapper>
      {/* Hero Section */}
      <div className="bg-[url('/story.jpeg')] bg-cover bg-center h-80 md:h-[600px] w-full relative mb-10 md:mb-20">
        <h1 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-2xl sm:text-3xl md:text-4xl font-bold">
          OUR STORY
        </h1>
      </div>
      {/* Info Section */}
      <div className="container mx-auto flex flex-col gap-10 md:gap-20 mb-10 md:mb-20 px-4 sm:px-10 md:px-20">
        <p className="tracking-widest text-sm sm:text-base leading-relaxed">
          Everybody loves the sweet scented aroma of their favourite dishes
          filling up their homes. More than that, we love the sumptuous taste of
          the food when it first touches our tongues and fills up our mouths
          with its cocktail of herbs and spices and juices that leave a
          lingering taste many hours after we are done eating. Food is life and
          it must be enjoyed, it brings health and it also brings joy… this is
          the story of Nana’s Kitchen.
        </p>
        <p className="tracking-widest text-sm sm:text-base leading-relaxed">
          Nana’s Kitchen is a homemade food business located in Texas, that is
          happy to bring you delicious Ghanaian-style homemade food that truly
          brings you joy. For Ghanaians living in Texas, this affords you the
          opportunity to enjoy the meals you loved back home in the flavors you
          loved them; the hot chicken and goat light soup that leaves your eyes
          teary and your lips on fire, the smooth okro soup that glides
          skillfully down into your belly and that peanut butter (groundnut)
          soup that is full of flavor to carry your fufu all the way. For
          non-Ghanaians who wish to swim in this same excitement, Nana’s Kitchen
          is your source for the sauce! Checkout{" "}
          <span className="font-bold">our Masukor Menu</span> to place an order
          for homemade food, made in sizable servings to last you several days.
          Ideal for very busy individuals and families who cannot combine
          cooking time with all the other things on their plate, embrace what we
          truly are…an extension of your kitchen.
        </p>
        <p className="tracking-widest text-sm sm:text-base leading-relaxed">
          We have taken centuries-old recipes and lots of feedback over the
          years to create formulas that will indeed keep you wanting more, and
          among these is the crown jewel of our operations, the Nana’s Kitchen
          Shito (pronounced SHI-tor).
        </p>
        <p className="tracking-widest text-sm sm:text-base leading-relaxed">
          Shito is hot pepper sauce that is ubiquitous with Ghanaian cuisine. It
          borrows its name from the Ga name for pepper (Ga is a Ghanaian tribe
          that inhabits primarily the Greater Accra Region of Ghana where the
          capital city, Accra is located). It is typically made from a mixture
          of dried and ground chilli pepper, oil, dried anchovies and other
          fishes, crustaceans, ginger and other spices among other ingredients.
          Though Shito is typically known to be that full flavored black sauce
          visible on a variety of Ghanaian dishes, it can also be made as red or
          green pepper amongst others. Shito is ideal to use as a sauce for
          eating pretty much any meal, it is the perfect dip for fries, chips,
          wings, ribs and so on. It also works great as a spread for bread and
          tacos. Check out our recipes page for sample recipes and combinations
          you can make with shito.
        </p>
        <p className="tracking-widest text-sm sm:text-base leading-relaxed">
          From humble beginnings of making free shito for a military friend on
          deployment, to serving hundreds of others through recommendations and
          word of mouth, we bring you a magic sauce that keeps giving.
        </p>
      </div>
    </Wrapper>
  );
};

export default OurStoryPage;

// COLORS
import lostAndFoundScreen from "../screens/LostAndFoundScreen";

export const appPurpleDark = '#8059F0';
export const appPurpleLight = '#C9BAF3';
export const borderGrey = '#BBC1CF';
export  const postGrey= '#F1F1F6';

//DIRECTORIES
export const fbStorageUserImagesDirectory = '/user-images';
export const fbStoragePetImagesDirectory = '/pet-images';

//ROUTES
export const MainAppRoute= 'App';
export const HomeScreenRoute = 'Home';
export  const AdoptionScreenRoute = 'Adoption';
export const LoginScreenRoute = 'Login';
export const SignupScreenRoute = 'Signup';
export const UploadImageScreenRoute = 'UploadImage';
export const ViewPetScreenRoute = 'Pet Details';
export const ProfileScreenRoute = 'Profile';
export const EditUserDetailsScreenRoute = 'Edit Details';
export const ChangePasswordScreenRoute = 'Change Password';
export const ChatScreenRoute = 'Chat Screen';
export const ViewChatsScreenRoute='Chats';
export const SavedPostsScreenRoute='Saved';
export const OTPScreenRoute='Verify Phone Number';
export const FilterPostsScreenRoute = "Filters";
export const LostAndFoundScreenRoute = "Lost and Found";
export const HostingScreenRoute = "Hosting";



export const CreatePetProfileScreenRoute='Create pet profile';
export const AddAdoptionPostScreenRoute='Add Adoption Post';
export const AddHostingPostScreenRoute='Add Hosting Post';
export const PostTypesListScreenRoute='Choose Post Type';


//Lists

export const catAndDogColors = [
    { label: 'Black', value: 'black' },
    { label: 'White', value: 'white' },
    { label: 'Gray', value: 'gray' },
    { label: 'Brown', value: 'brown' },
    { label: 'Red', value: 'red' },
    { label: 'Golden', value: 'golden' },
    { label: 'Cream', value: 'cream' },
    { label: 'Chocolate', value: 'chocolate' },
    { label: 'Apricot', value: 'apricot' },
    { label: 'Beige', value: 'beige' },
    { label: 'Spotted', value: 'spotted' },
    { label: 'Bicolor', value: 'bicolor' },
    { label: 'Tricolor', value: 'tricolor' },
    { label: 'Harlequin', value: 'harlequin' }
];

export const vaccinationOptions = [
    { label: 'None', value: 'none' },
    { label: 'Some', value: 'some' },
    { label: 'All mandatory', value: 'allMandatory' },
];
export const egyptianCities = [{label: 'Cairo', value: 'Cairo'},
    {label: 'Alexandria', value: 'Alexandria'},
    {label: 'Giza', value: 'Giza'},
    {label: 'Shubra El-Kheima', value: 'Shubra El-Kheima'},
    {label: 'Port Said', value: 'Port Said'},
    {label: 'Suez', value: 'Suez'},
    {label: 'Luxor', value: 'Luxor'},
    {label: 'El-Mahalla El-Kubra', value: 'El-Mahalla El-Kubra'},
    {label: 'Asyut', value: 'Asyut'},
    {label: 'Tanta', value: 'Tanta'},
    {label: 'El-Faiyum', value: 'El-Faiyum'},
    {label: 'Ismailia', value: 'Ismailia'},
    {label: 'El-Minya', value: 'El-Minya'},
    {label: 'Zagazig', value: 'Zagazig'},
    {label: 'Damietta', value: 'Damietta'},
    {label: 'Aswan', value: 'Aswan'},
    {label: 'Mansoura', value: 'Mansoura'},
    {label: 'Beni Suef', value: 'Beni Suef'},
    {label: 'Sohag', value: 'Sohag'},
    {label: 'Hurghada', value: 'Hurghada'},
];

export const egyptianCatBreeds = [
    { label: 'Egyptian Mau', value: 'Egyptian Mau' },
    { label: 'Persian', value: 'Persian' },
    { label: 'Siamese', value: 'Siamese' },
    { label: 'Sphynx', value: 'Sphynx' },
    { label: 'Munchkin', value: 'Munchkin' },
    { label: 'British Shorthair', value: 'British Shorthair' },
    { label: 'Maine Coon', value: 'Maine Coon' },
    { label: 'Bengal', value: 'Bengal' },
    { label: 'Savannah', value: 'Savannah' },
    { label: 'Scottish Fold', value: 'Scottish Fold' }
];

export const egyptianDogBreeds = [
    { label: 'German Shepherd', value: 'German Shepherd' },
    { label: 'Labrador Retriever', value: 'Labrador Retriever' },
    { label: 'Golden Retriever', value: 'Golden Retriever' },
    { label: 'Rottweiler', value: 'Rottweiler' },
    { label: 'Bulldog', value: 'Bulldog' },
    { label: 'Boxer', value: 'Boxer' },
    { label: 'Siberian Husky', value: 'Siberian Husky' },
    { label: 'Doberman Pinscher', value: 'Doberman Pinscher' },
    { label: 'Poodle', value: 'Poodle' },
    { label: 'Great Dane', value: 'Great Dane' }
];

export const services = [
    {serviceId: 1,
        name: "Adoption",
        imageUri: require('../assets/adoption.jpg')
    }
    ,
    {serviceId: 2,
        name: "Hosting",
        imageUri: require('../assets/neo.jpg')
    },
    {serviceId: 3,
        name: "Lost and Found",
        imageUri: require('../assets/lost.png')
    },
    {serviceId: 4,
        name: "Breeding",
        imageUri: require('../assets/breeding.jpg')
    },
    {serviceId: 5,
        name: "Market Place",
        imageUri: require('../assets/market.png')
    }
]


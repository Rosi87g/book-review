import menu_icon from './menu_icon.svg'
import cross_icon from './cross_icon.png'
import chats_icon from './chats_icon.svg'
import arrow_icon from './arrow_icon.svg'
import info_icon from './info_icon.svg'
import upload_icon from './upload_icon.png'
import verified_icon from './verified_icon.svg'
import book1 from './book1.jpg'
import book2 from './book2.jpg'
import book3 from './book3.jpg'
import book4 from './book4.jpg'
import book5 from './book5.jpg'
import book6 from './book6.jpg'
import book7 from './book7.jpg'
import book8 from './book8.jpg'
import book9 from './book9.jpg'
import book10 from './book10.jpg'
import banner from './banner.png'
import profile_pic from './profile.png'
import logoblack from './LogoBlack.png'


export const assets = {
    chats_icon,
    logoblack,
    info_icon,
    profile_pic,
    verified_icon,
    banner,
    arrow_icon,
    menu_icon,
    cross_icon,
    upload_icon,
}

export const bookslist = [
    {
        _id: 'bookId1',
        title: 'Ender’s Game',
        image: book1,
        Author: 'Orson Scott Card',
        Description: `In a future where Earth faces annihilation from an alien race known as the Buggers, humanity turns to its brightest children to lead the defense. Among them is Ender Wiggin, a six-year-old genius who is recruited by the International Fleet after showing exceptional strategic potential. Though his older siblings, Peter and Valentine, were also monitored, only Ender is chosen — a decision that fuels Peter’s resentment and deepens Ender’s isolation.

Ender is sent to Battle School, a space-based training facility where children are molded into military commanders. There, he faces intense psychological pressure, isolation, and competition. Despite this, Ender quickly rises through the ranks by mastering zero-gravity combat and forming strong bonds with fellow students like Alai and Petra Arkanian. His tactical brilliance earns him command of his own army, Dragon Army, which he leads to unprecedented victories.

As Ender’s training intensifies, he faces growing hostility from older students and even his commanders. He is forced into brutal confrontations, including a deadly fight with Bonzo Madrid, a rival who resents Ender’s success. Meanwhile, back on Earth, Peter and Valentine manipulate global politics under pseudonyms, shaping the future of humanity through online influence.

Eventually, Ender is transferred to Command School, where he trains under the legendary Mazer Rackham, the hero of the previous Bugger war. Ender is put through increasingly complex simulations, culminating in a final test where he unknowingly commands a real fleet and destroys the Bugger homeworld. The victory is bittersweet — Ender learns he was manipulated into committing genocide.

Haunted by guilt, Ender discovers a surviving Bugger queen egg and vows to find a new home for her species. He becomes the Speaker for the Dead, seeking redemption and understanding. Ender’s Game explores themes of leadership, isolation, morality, and the cost of war — all through the eyes of a child forced to carry the fate of humanity.`,
        Genre: 'Sci-Fi',
        Year: 1985,
        addedBy: 'user123',
        reviews: [
            {
                userId: 'user456',
                rating: 5,
                reviewText: 'Absolutely brilliant. Ender’s journey is unforgettable.'
            },
            {
                userId: 'user789',
                rating: 5,
                reviewText: 'Great pacing and depth. Loved the zero-gravity battles.'
            }
        ]
    },
    {
        _id: 'bookId2',
        title: 'The Martian',
        image: book2,
        Author: 'Andy Weir',
        Description: 'A stranded astronaut uses science to survive on Mars.',
        Genre: 'Sci-Fi',
        Year: 2011,
        addedBy: 'user123',
        reviews: [
            {
                userId: 'user456',
                rating: 5,
                reviewText: 'Absolutely brilliant. Ender’s journey is unforgettable.'
            },
            {
                userId: 'user789',
                rating: 4,
                reviewText: 'Great pacing and depth. Loved the zero-gravity battles.'
            }
        ]
    },
    {
        _id: 'bookId3',
        title: 'Foundation',
        image: book3,
        Author: 'Isaac Asimov',
        Description: 'A mathematician predicts the fall of civilization and plans its rebirth.',
        Genre: 'Sci-Fi',
        Year: 1951,
        addedBy: 'user123',
        reviews: [
            {
                userId: 'user456',
                rating: 5,
                reviewText: 'Absolutely brilliant. Ender’s journey is unforgettable.'
            },
            {
                userId: 'user789',
                rating: 4,
                reviewText: 'Great pacing and depth. Loved the zero-gravity battles.'
            }
        ]
    },
    {
        _id: 'bookId4',
        title: 'Fahrenheit 451',
        image: book4,
        Author: 'Ray Bradbury',
        Description: 'A dystopia where books are banned and burned.',
        Genre: 'Sci-Fi',
        Year: 1953,
        addedBy: 'user123',
        reviews: [
            {
                userId: 'user456',
                rating: 5,
                reviewText: 'Absolutely brilliant. Ender’s journey is unforgettable.'
            },
            {
                userId: 'user789',
                rating: 4,
                reviewText: 'Great pacing and depth. Loved the zero-gravity battles.'
            }
        ]
    },
    {
        _id: 'bookId5',
        title: 'Pride and Prejudice',
        image: book5,
        Author: 'Jane Austen',
        Description: 'A classic tale of love, wit, and social class.',
        Genre: 'Romance',
        Year: 1813,
        addedBy: 'user123',
        reviews: [
            {
                userId: 'user456',
                rating: 5,
                reviewText: 'Absolutely brilliant. Ender’s journey is unforgettable.'
            },
            {
                userId: 'user789',
                rating: 4,
                reviewText: 'Great pacing and depth. Loved the zero-gravity battles.'
            }
        ]
    },
    {
        _id: 'bookId6',
        title: 'The Fault in Our Stars',
        image: book6,
        Author: 'John Green',
        Description: 'Two teens with cancer fall in love and face mortality.',
        Genre: 'Romance',
        Year: 2012,
        addedBy: 'user123',
        reviews: [
            {
                userId: 'user456',
                rating: 5,
                reviewText: 'Absolutely brilliant. Ender’s journey is unforgettable.'
            },
            {
                userId: 'user789',
                rating: 4,
                reviewText: 'Great pacing and depth. Loved the zero-gravity battles.'
            }
        ]
    },
    {
        _id: 'bookId7',
        title: 'Outlander',
        image: book7,
        Author: 'Diana Gabaldon',
        Description: 'A nurse time-travels to 18th-century Scotland and finds love',
        Genre: 'Romance',
        Year: 1991,
        addedBy: 'user123',
        reviews: [
            {
                userId: 'user456',
                rating: 5,
                reviewText: 'Absolutely brilliant. Ender’s journey is unforgettable.'
            },
            {
                userId: 'user789',
                rating: 4,
                reviewText: 'Great pacing and depth. Loved the zero-gravity battles.'
            }
        ]
    },
    {
        _id: 'bookId8',
        title: 'Twilight',
        image: book8,
        Author: 'Stephenie Meyer',
        Description: 'A vampire-human romance with suspense and danger.',
        Genre: 'Romance',
        Year: 2005,
        addedBy: 'user123',
        reviews: [
            {
                userId: 'user456',
                rating: 5,
                reviewText: 'Absolutely brilliant. Ender’s journey is unforgettable.'
            },
            {
                userId: 'user789',
                rating: 4,
                reviewText: 'Great pacing and depth. Loved the zero-gravity battles.'
            }
        ]
    },
    {
        _id: 'bookId9',
        title: 'Gone Girl',
        image: book9,
        Author: 'Gillian Flynn',
        Description: 'A wife’s disappearance reveals dark secrets and manipulation.',
        Genre: 'Thriller',
        Year: 2012,
        addedBy: 'user123',
        reviews: [
            {
                userId: 'user456',
                rating: 5,
                reviewText: 'Absolutely brilliant. Ender’s journey is unforgettable.'
            },
            {
                userId: 'user789',
                rating: 4,
                reviewText: 'Great pacing and depth. Loved the zero-gravity battles.'
            }
        ]
    },
    {
        _id: 'bookId10',
        title: 'Mindset',
        image: book10,
        Author: 'Carol S. Dweck',
        Description: 'How a growth mindset transforms achievement and resilience.',
        Genre: 'Psychology',
        Year: 2006,
        addedBy: 'user123',
        reviews: [
            {
                userId: 'user456',
                rating: 5,
                reviewText: 'Absolutely brilliant. Ender’s journey is unforgettable.'
            },
            {
                userId: 'user789',
                rating: 4,
                reviewText: 'Great pacing and depth. Loved the zero-gravity battles.'
            }
        ]
    },



]
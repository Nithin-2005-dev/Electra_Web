import { GiPartyPopper ,GiTeacher} from "react-icons/gi";
import { CgGames } from "react-icons/cg";
import { GrTechnology } from "react-icons/gr";
import { MdOutlineSportsHandball } from "react-icons/md";
import { FaLaptopCode } from "react-icons/fa";
import { PiStudentFill } from "react-icons/pi";
import { FaChild } from "react-icons/fa";
const EventData = [
    {
        title:'Udvega',
        description:`Udvega, the annual kick-starter for our society's vibrant culture! Post the grand induction of the latest batch, we organize this spectacular shindig. Bursting with talent, the fresh faces showcase their moves in dance and music extravaganzas. The excitement crescendos with riveting games, ensuring an electrifying ambiance.`,
        icon:<FaChild />
    },
    {
        title:'Blitzsurge',
        description:`Blitzsurge is a fun event hosted by the society. It includes exciting events like Call of Duty, Meme war, Picture Perception  and many more events that allows the students to explore their talents with fun and joy.`,
        icon:<CgGames />
    },
    {
        title:'Power surge',
        description:`Power Surge is the technical event hosted by the society. It includes exciting events like Crack the Job, Logo Designing, IPL Auction voice of Electra and many more events that allows the students to explore their talents with fun and joy.`,
        icon:<GrTechnology />
    },
    {
        title:'Electra cup',
        description:`Electra Cup is the sports event arranged by Electra Society. It is the inter batch sports competition that includes games like cricket, futsal, badminton, chess, and so on.`,
        icon:<MdOutlineSportsHandball />
    },
    {
        title:'Electra dev module',
        description:`Electra-Dev module is the Web Development module under Electra Society. Students of the department who are interested in Web development are part of this module.`,
        icon:<GiTeacher />
    },
    {
        title:'Codesta',
        description:`Codesta is the coding module of Electra Society. Codenza is the Coding Competition arranged by Electra Society under Codesta. Electrical Engineering students unleash and showcase their coding skills in this competition.`,
        icon:<FaLaptopCode />
    },
    {
        title:'Carvaan',
        description:`After completion of B.Tech in four years every batch pass out from the college. Electra Society arranges Carvaan each year to bid farewell to the outgoing batch from our department.`,
        icon:<PiStudentFill />
    },
];
export { EventData };

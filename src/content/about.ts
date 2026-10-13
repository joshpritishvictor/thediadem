import { Clock, MapPin, UserRound } from 'lucide-react'
import officeImg from '../assets/images/about/office.webp'
import teamImg from '../assets/images/about/team.webp'

export const about = {
  eyebrow: 'Our Story',
  heading: 'One Network. The Right Expertise. A Simpler Experience.',
  images: { primary: teamImg, secondary: officeImg },
  story: [
    'Diadem Strategies Incorporated was founded in Calgary, Alberta, to solve a fundamental problem in corporate management: fragmentation. While Diadem is a newly established corporate entity, our model is powered by a network of licensed accountants, financial planners, insurance brokers, and legal partners who bring decades of combined experience to your business.',
    'Most successful business owners need multi-disciplinary support, but managing multiple firms takes time away from growth. Diadem serves as your central point of access to trusted accounting, advisory, insurance, and legal professionals.',
  ],
  pillars: {
    eyebrow: 'Why Diadem',
    heading: 'What you can expect',
    items: [
      {
        icon: UserRound,
        title: 'Single Point of Contact',
        body: 'Your dedicated Diadem contact helps navigate access across the network and keeps communication flowing between your professionals.',
      },
      {
        icon: Clock,
        title: 'Timely Connections',
        body: 'Get in front of the right professional before a key deadline or decision becomes urgent — not after.',
      },
      {
        icon: MapPin,
        title: 'Rooted in Alberta',
        body: 'Built for Alberta business owners and families, backed by a network of professionals who understand the local corporate landscape.',
      },
    ],
  },
}

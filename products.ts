import { Product } from '../types';

export const PRODUCTS: Product[] = [
  {
    id: 'chatgpt-monetization',
    title: 'The ChatGPT Monetization System',
    subtitle: 'From AI skills to your first ₦100K client revenue',
    category: 'AI · Freelancing · Services',
    description:
      'A structured approach to turning ChatGPT skills into a service offer, finding prospects and working toward paid client projects.',
    longDescription: `What if ChatGPT could become more than just a tool you use—you could turn the skills you build with it into services people actually pay for?

The ChatGPT Monetization System is a practical step-by-step guide designed to help you turn ChatGPT-assisted skills into a sellable online service.

Instead of simply teaching you prompts or generic “ways to make money with AI,” this system focuses on the monetization process:

AI skill → Service → Offer → Prospect → Client → Revenue

You'll learn how to identify a service you can realistically provide, create your first samples, package your service, find potential clients, communicate with prospects, close projects, deliver professionally, and build toward your first ₦100,000 in client revenue.`,
    selarUrl: 'https://selar.com/88j936si11',
    priceNote: 'Income targets are not guarantees.',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
    color: '#1e3a5f',
  },
  {
    id: 'sideshift-ugc',
    title: 'SideShift UGC Campaign Blueprint',
    subtitle: 'How to Make Your First $1,000 on SideShift',
    category: 'UGC · Content Creation',
    description:
      'A practical guide to campaign selection, hooks, scripts, filming, editing and a repeatable creator workflow.',
    longDescription: `A complete practical system for creating high-converting UGC content on SideShift.

This blueprint covers:
• How to select the right campaigns
• Proven hooks that stop the scroll
• Script frameworks that convert
• Filming and editing workflow
• Building a repeatable daily/weekly creator system

Designed to help creators move from zero to their first $1,000 in a structured way.`,
    selarUrl: 'https://selar.com/4a3l88s17y',
    priceNote: '$1,000 is a target, not a promised result.',
    image: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=800&q=80',
    color: '#0f766e',
  },
  {
    id: 'customer-magnet',
    title: 'Customer Magnet Blueprint',
    subtitle: 'Build a clearer path to finding customers',
    category: 'Online Business · Sales',
    description:
      'A resource for improving customer attraction, offer clarity and the way you communicate value to potential buyers.',
    longDescription: `Most people struggle not because their product is bad, but because they cannot clearly attract and convert the right customers.

The Customer Magnet Blueprint helps you:
• Clarify your ideal customer
• Improve your offer positioning
• Communicate value more effectively
• Create a simple attraction system

Practical frameworks you can apply immediately to any online offer.`,
    selarUrl: null,
    priceNote: 'Selar link coming soon.',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
    color: '#7c2d12',
  },
  {
    id: 'dropshipping',
    title: 'Dropshipping Success Blueprint',
    subtitle: 'Organise your dropshipping learning',
    category: 'E-commerce · Operations',
    description:
      'A blueprint for learning the foundations of product selection, store setup, fulfilment and customer experience.',
    longDescription: `A clear learning path for anyone serious about dropshipping.

Covers:
• Product research and selection criteria
• Store setup best practices
• Supplier and fulfilment fundamentals
• Customer experience that reduces refunds
• Simple systems to stay organised

Focuses on foundations rather than hype.`,
    selarUrl: null,
    priceNote: 'Selar link coming soon.',
    image: 'https://images.unsplash.com/photo-1556740758-90decb9c8b8b?w=800&q=80',
    color: '#1e40af',
  },
  {
    id: 'codm-master',
    title: 'CODM Master System · 2026 Edition',
    subtitle: 'Build a more deliberate game plan',
    category: 'Gaming · Call of Duty Mobile',
    description:
      'A gaming guide for a more structured approach to practice, loadouts and in-game improvement.',
    longDescription: `Stop playing on autopilot.

The CODM Master System · 2026 Edition gives you a structured approach to:
• Deliberate practice routines
• Loadout optimization
• Map awareness and decision making
• Tracking improvement over time

Built for players who want measurable progress instead of random grinding.`,
    selarUrl: null,
    priceNote: 'Selar link coming soon.',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80',
    color: '#581c87',
  },
];

export const getProductById = (id: string): Product | undefined =>
  PRODUCTS.find((p) => p.id === id);

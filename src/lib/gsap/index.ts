import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CustomEase } from 'gsap/CustomEase';
import { SplitText } from 'gsap/SplitText';
import { ScrollSmoother } from 'gsap/ScrollSmoother';

gsap.registerPlugin(ScrollTrigger, CustomEase, SplitText, ScrollSmoother);

export { gsap, ScrollTrigger, CustomEase, SplitText, ScrollSmoother };
export default gsap;

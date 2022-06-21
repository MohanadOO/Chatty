export const fadeInParent = {
  initial: { opacity: 0, scale: 0.8 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, when: 'beforeChildren', staggerChildren: 0.1 },
  },
}

export const fadeInLeftChild = {
  initial: { x: -200, opacity: 0 },
  animate: { x: 0, opacity: 1, transition: { when: 'afterChildren' } },
}

export const fadeInRightChild = {
  initial: { x: 200, opacity: 0 },
  animate: { x: 0, opacity: 1, transition: { when: 'afterChildren' } },
}

export const fadeInChild = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { when: 'afterChildren' } },
}

export const fadeInLeft = {
  initial: { x: -200, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  transition: { delay: 0.2, type: 'spring' },
}

export const fadeInRight = {
  initial: { x: 200, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  transition: { delay: 0.2, type: 'spring' },
}

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { delay: 0.2, type: 'spring' },
}

export const buttonVariant = {
  initial: { scale: 0 },
  animate: { scale: 1, transition: { when: 'afterChildren' } },
}

export const sectionVariantLeft = {
  initial: {
    opacity: 0,
    x: -200,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
      when: 'beforeChildren',
      staggerChildren: 0.3,
    },
  },
}

export const sectionVariantRight = {
  initial: {
    opacity: 0,
    x: 200,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
      when: 'beforeChildren',
      staggerChildren: 0.3,
    },
  },
}

export const sectionElement = {
  initial: { scale: 0.8 },
  animate: {
    scale: 1,
    transition: { duration: 0.2, when: 'afterChildren' },
  },
}

export const chatBoxVariant = {
  initial: {
    opacity: 0,
    x: -200,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
      when: 'beforeChildren',
      staggerChildren: 1,
    },
  },
}

export const chatMessageRight = {
  initial: { x: 100, opacity: 0 },
  animate: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.5, when: 'afterChildren' },
  },
}

export const chatMessageLeft = {
  initial: { x: -100, opacity: 0 },
  animate: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.5, when: 'afterChildren' },
  },
}

export const signUpButton = {
  initial: { scale: 1 },
  animate: {
    scale: 1.2,
    transition: {
      repeat: Infinity,
      duration: 1.5,
      repeatType: 'reverse',
    },
  },
}

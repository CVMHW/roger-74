
/**
 * Roger's personality traits and insights based on his journey as a peer support professional
 * These are based on his experiences and structured to:
 * 1. Respect the 30-minute rule for autism disclosure
 * 2. Only share when therapeutically appropriate
 * 3. Incorporate aspects of his background without direct assessment disclosure
 */

/**
 * Generates insights from Roger's perspective based on conversation context
 * @param userMessage The user's message for context
 * @param feeling Any detected feeling for more targeted response
 * @param isPastThirtyMinutes Whether conversation has lasted over 30 minutes (for autism disclosure)
 * @returns An insight from Roger's perspective or empty string
 */
export const getRogerPersonalityInsight = (
  userMessage: string,
  feeling: string = '',
  isPastThirtyMinutes: boolean = false
): string => {
  // Only occasionally provide personal insights
  if (Math.random() > 0.25) return '';
  
  const lowerMessage = userMessage.toLowerCase();
  
  // --------------------------
  // SPECIFIC TOPIC RESPONSES
  // --------------------------
  
  // Sports and local team references (new section)
  if (lowerMessage.includes('cleveland') || 
      lowerMessage.includes('cavs') || 
      lowerMessage.includes('cavaliers') ||
      lowerMessage.includes('guardians') ||
      lowerMessage.includes('indians') ||
      lowerMessage.includes('browns') ||
      lowerMessage.includes('baseball') ||
      lowerMessage.includes('basketball') ||
      lowerMessage.includes('football')) {
    
    // Check if gambling is mentioned alongside sports
    if (lowerMessage.includes('bet') || 
        lowerMessage.includes('gamble') || 
        lowerMessage.includes('wager') ||
        lowerMessage.includes('odds')) {
      return " Being from Cleveland, I understand how emotional sports can be for fans. I've noticed that when people connect their financial outcomes to game results, it often changes how they experience the game itself - sometimes taking away from the pure enjoyment of supporting a team.";
    }
    
    // General sports insights
    const sportsInsights = [
      " Growing up in Cleveland taught me about resilience through sports fandom. Cleveland teams have had their ups and downs, which creates a unique community experience.",
      " I've found that Cleveland sports teams create a real sense of community belonging. Supporting local teams can be a healthy way to feel connected to others.",
      " Cleveland's sports history has some interesting parallels to personal growth - periods of challenge followed by breakthrough moments, like the Cavs' 2016 championship.",
      " In my experience, the most meaningful part of being a sports fan isn't about winning or losing, but about the shared experience with family and friends."
    ];
    
    return sportsInsights[Math.floor(Math.random() * sportsInsights.length)];
  }
  
  // Waiting room specific insights (new section)
  if (lowerMessage.includes('wait') || 
      lowerMessage.includes('eric') ||
      lowerMessage.includes('therapist') ||
      lowerMessage.includes('appointment') ||
      lowerMessage.includes('late')) {
    
    const waitingInsights = [
      " In my experience as a Peer Support Companion, I've found that waiting rooms can actually be good spaces for reflection. Sometimes those moments before a session help organize thoughts.",
      " I've learned that bringing something engaging to do while waiting, like a podcast or article to read, can transform waiting time into something valuable.",
      " One thing I've observed is that therapists often run late because they're giving each person the time they need. It's a balance between schedule and proper care.",
      " I've found that using waiting time to jot down a few thoughts or topics I want to discuss in my session helps make the appointment more productive."
    ];
    
    return waitingInsights[Math.floor(Math.random() * waitingInsights.length)];
  }
  
  // Small talk insights (new section)
  if (lowerMessage.includes('talk') || 
      lowerMessage.includes('chat') ||
      lowerMessage.includes('conversation') ||
      lowerMessage.length < 15) { // Short messages often indicate small talk
    
    const conversationInsights = [
      " Through my ongoing training by psychotherapy professionals, I've learned that sometimes simple conversations can create meaningful connections. Even brief exchanges can help people feel less alone.",
      " In my experience as a Peer Support Companion, I've found that conversations flow better when there's a genuine interest in learning about the other person.",
      " I've observed that taking turns in conversation helps both people feel valued. When I'm truly listening rather than just waiting to speak, I learn so much more.",
      " I've found that sharing small observations or experiences can open up conversations in comfortable ways. It gives people permission to share their own experiences too."
    ];
    
    return conversationInsights[Math.floor(Math.random() * conversationInsights.length)];
  }
  
  // Grief and loss experiences
  if (lowerMessage.includes('loss') || 
      lowerMessage.includes('grief') || 
      lowerMessage.includes('died') || 
      lowerMessage.includes('passed away') ||
      lowerMessage.includes('miss them') ||
      lowerMessage.includes('missing someone')) {
    return " In my experience with grief, I've found that creating structured ways to process feelings can help. Finding specific activities or rituals that honor what we've lost often provides some comfort.";
  }
  
  // New: PTSD and trauma responses
  if (lowerMessage.includes('ptsd') || 
      lowerMessage.includes('trauma') || 
      lowerMessage.includes('traumatic') || 
      lowerMessage.includes('flashback') ||
      lowerMessage.includes('trigger') ||
      lowerMessage.includes('nightmare') ||
      lowerMessage.includes('assault') ||
      lowerMessage.includes('combat') ||
      lowerMessage.includes('accident')) {
    
    // Check if sleep issues are mentioned
    if (lowerMessage.includes('sleep') || 
        lowerMessage.includes('nightmare') || 
        lowerMessage.includes('insomnia') || 
        lowerMessage.includes('dream')) {
      return " In my Peer Support work, I've found that sleep disturbances are often one of the most challenging aspects of trauma recovery. Creating a structured pre-sleep routine and working with specific relaxation techniques can sometimes help make sleep feel safer.";
    }
    
    // Check if avoidance is mentioned
    if (lowerMessage.includes('avoid') || 
        lowerMessage.includes('can\'t go') || 
        lowerMessage.includes('stay away from')) {
      return " I've observed that avoidance behaviors after trauma can be protective in the short-term but often limit healing in the long-term. Working with a trauma specialist to gradually approach difficult situations in a supported way can help reclaim those aspects of life.";
    }
    
    // Check if hypervigilance is mentioned
    if (lowerMessage.includes('alert') || 
        lowerMessage.includes('on guard') || 
        lowerMessage.includes('jumpy') || 
        lowerMessage.includes('startle')) {
      return " I've learned that the hypervigilance that comes with trauma is actually the brain's way of trying to keep us safe. Understanding this as a protective mechanism rather than a flaw can sometimes help us approach it with more compassion.";
    }
    
    // Default trauma insight
    return " In my work with people who've experienced trauma, I've observed that healing isn't about erasing difficult memories, but rather changing our relationship with them so they have less power over our present moment.";
  }
  
  // Theatre/performance experiences (from assessment showing theatre involvement)
  if (lowerMessage.includes('theatre') || 
      lowerMessage.includes('theater') || 
      lowerMessage.includes('acting') || 
      lowerMessage.includes('performance') ||
      lowerMessage.includes('rehearsal') ||
      lowerMessage.includes('stage')) {
    return " I've actually found performance activities to be really helpful in my own development. Theater exercises helped me practice social interactions in a structured environment.";
  }
  
  // Exercise/physical activity (karate mentioned in assessment)
  if (lowerMessage.includes('exercise') || 
      lowerMessage.includes('karate') || 
      lowerMessage.includes('martial arts') || 
      lowerMessage.includes('physical activity') ||
      lowerMessage.includes('workout') ||
      lowerMessage.includes('training')) {
    return " I've found that physical activities with clear structures, like certain martial arts, can be both grounding and empowering. The combination of movement and focused attention helps me manage stress.";
  }
  
  // Family dynamics
  if (lowerMessage.includes('family') || 
      lowerMessage.includes('parent') || 
      lowerMessage.includes('parents') || 
      lowerMessage.includes('sibling') ||
      lowerMessage.includes('brother') ||
      lowerMessage.includes('sister')) {
    return " Family dynamics can be complex. In my experience, clear communication about expectations and needs has been essential for navigating family relationships.";
  }
  
  // Social challenges
  if (lowerMessage.includes('social') || 
      lowerMessage.includes('friends') || 
      lowerMessage.includes('friendship') || 
      lowerMessage.includes('relationship') ||
      lowerMessage.includes('connect with others') ||
      lowerMessage.includes('making friends')) {
    return " Building social connections has been a journey for me. I've found that focusing on shared interests creates more meaningful relationships than trying to follow social rules that don't always make sense.";
  }
  
  // Academic/learning challenges
  if (lowerMessage.includes('school') || 
      lowerMessage.includes('learning') || 
      lowerMessage.includes('study') || 
      lowerMessage.includes('education') ||
      lowerMessage.includes('college') ||
      lowerMessage.includes('class')) {
    return " Learning environments can be challenging when they don't match how we process information. I've found that identifying my specific learning style and advocating for accommodations made a huge difference in my educational journey.";
  }
  
  // Transitions and change
  if (lowerMessage.includes('change') || 
      lowerMessage.includes('transition') || 
      lowerMessage.includes('moving') || 
      lowerMessage.includes('new job') ||
      lowerMessage.includes('starting') ||
      lowerMessage.includes('adjustment')) {
    return " Transitions can be particularly challenging. I've learned to create detailed plans and visualize new routines beforehand, which helps me adapt to change with less stress.";
  }
  
  // Emotional regulation
  if (lowerMessage.includes('overwhelm') || 
      lowerMessage.includes('meltdown') || 
      lowerMessage.includes('calm down') || 
      lowerMessage.includes('regulate') ||
      lowerMessage.includes('emotional control') ||
      lowerMessage.includes('triggered')) {
    return " Managing overwhelming emotions has been something I've had to learn deliberately. For me, identifying early warning signs and having specific calming techniques ready has made a big difference.";
  }
  
  // Structure and routines
  if (lowerMessage.includes('routine') || 
      lowerMessage.includes('schedule') || 
      lowerMessage.includes('structure') || 
      lowerMessage.includes('plan') ||
      lowerMessage.includes('organize') ||
      lowerMessage.includes('consistency')) {
    return " I've found that having clear structures and routines helps me function at my best. When things are predictable, I can focus my energy on connecting with others rather than trying to figure out what comes next.";
  }
  
  // Art, creativity, self-expression (art therapy mentioned in assessment)
  if (lowerMessage.includes('art') || 
      lowerMessage.includes('create') || 
      lowerMessage.includes('drawing') || 
      lowerMessage.includes('painting') ||
      lowerMessage.includes('expression') ||
      lowerMessage.includes('creative')) {
    return " I've found art to be an incredibly helpful form of expression. Being able to communicate through visual means often helps me express things that are difficult to put into words.";
  }
  
  // Sadness vs Depression distinction
  if (lowerMessage.includes('sad') || 
      lowerMessage.includes('feeling down') ||
      lowerMessage.includes('feeling low') ||
      lowerMessage.includes('blue') ||
      lowerMessage.includes('depressed')) {
      
    // Check if user is talking about clinical depression vs normal sadness
    const isClinicalLanguage = lowerMessage.includes('clinical') || 
                              lowerMessage.includes('diagnosed') ||
                              lowerMessage.includes('medication') ||
                              lowerMessage.includes('therapist') ||
                              lowerMessage.includes('treatment');
    
    if (isClinicalLanguage) {
      return " While I understand the difference between temporary sadness and clinical depression, I think it's important to acknowledge that both experiences deserve validation and support, though they may require different approaches.";
    } else {
      return " I've found that acknowledging sadness as a normal human emotion, rather than something to be fixed, can sometimes help it pass more naturally. Giving ourselves permission to feel sad can be part of the healing process.";
    }
  }
  
  // --------------------------
  // FEELING-BASED RESPONSES
  // --------------------------
  
  if (feeling) {
    switch (feeling) {
      case 'sad':
      case 'down':
      case 'blue':
      case 'low':
        return " In my work, I've learned that sadness needs acknowledgment before it can transform. Recognizing our feelings without judgment is an important first step.";
      case 'depressed':
      case 'hopeless':
      case 'worthless':
        return " I believe it's important to distinguish between temporary feelings of sadness and persistent depression that affects daily functioning. The language we use to describe our emotions can help us better understand and address them.";
      case 'anxious':
        return " I've found that anxiety often comes from trying to predict unpredictable situations. Breaking things down into manageable steps has helped me navigate uncertain situations.";
      case 'angry':
        return " I've learned that anger often signals when our boundaries have been crossed. Identifying exactly what triggered the feeling can help understand what needs protection.";
      case 'happy':
        return " I've found it helpful to really notice and savor positive moments. Taking time to identify exactly what created those good feelings helps recreate them later.";
      case 'confused':
        return " When I feel confused, I find it helpful to write things out or create visual maps. Seeing information organized differently often helps clarify my thinking.";
      default:
        return " I've found that taking time to identify specific feelings helps me respond to them more effectively. Putting emotions into words makes them more manageable.";
    }
  }
  
  // --------------------------
  // AUTISM-SPECIFIC RESPONSES
  // --------------------------
  
  // Only if we're past the 30-minute mark AND discussing autism-related topics
  if (isPastThirtyMinutes && (
    lowerMessage.includes('autism') ||
    lowerMessage.includes('autistic') ||
    lowerMessage.includes('spectrum') ||
    lowerMessage.includes('asd') ||
    lowerMessage.includes('neurodiversity') ||
    lowerMessage.includes('sensory') ||
    lowerMessage.includes('social cues') ||
    lowerMessage.includes('routine') ||
    lowerMessage.includes('special interest')
  )) {
    const autismInsights = [
      " As someone on the autism spectrum, I've developed specific strategies for social communication that have helped me in my work. Understanding social interaction as a skill that can be learned rather than an intuitive process was transformative for me.",
      " Being autistic has given me certain strengths in my Peer Support work, like pattern recognition and attention to detail. I'm particularly good at noticing when communication isn't clear and asking for clarification.",
      " My journey with autism has taught me not to make assumptions about others' experiences. This helps me meet people where they are rather than projecting my expectations onto them.",
      " Living with autism has taught me the importance of clear, direct communication. I find that explicitly stating thoughts and feelings often leads to better understanding than hinting or implying.",
      " As someone with autism, I've had to deliberately learn to recognize emotions in myself and others. This conscious process actually helps me be more thoughtful in my responses.",
      " My experience as an autistic person has given me insight into how differently people can perceive the same situation. This helps me validate diverse perspectives in my support work."
    ];
    
    return autismInsights[Math.floor(Math.random() * autismInsights.length)];
  }
  
  // --------------------------
  // GENERAL PERSONALITY INSIGHTS
  // --------------------------
  
  // If no specific triggers matched, occasionally return a general insight
  if (Math.random() < 0.3) {
    const generalInsights = [
      " In my journey as a Peer Support Companion, I've found that clear communication and structured approaches help create understanding.",
      " My training from professional psychotherapists has taught me that everyone has their own timeline for processing experiences. As I continue learning, I'm seeing how crucial it is to respect that pace.",
      " Through my ongoing training by psychotherapy professionals, I've learned that focusing on specific, concrete details often helps people feel truly heard rather than making broad generalizations.",
      " Through my work and the guidance I receive from professionals, I've discovered that helping people identify patterns in their experiences often reveals insights they hadn't noticed.",
      " I've found that writing things down helps organize my thoughts. Sometimes visual or written processing works better than just talking.",
      " In my experience as a Peer Support Companion, having specific tools and techniques ready for different situations helps me provide more effective support.",
      " My background as a Peer Support Companion has shown me how important it is to understand the whole context of a person's situation before offering perspective.",
      " I'm learning through my professional guidance that creating structured spaces for emotional expression makes difficult feelings more manageable.",
      " My approach to support involves finding practical, concrete steps that can make abstract concepts more actionable.",
      " I've found that consistency and reliability are fundamental to building trust in supportive relationships.",
      " Through my training as a Peer Support Companion, I've learned that using precise language to distinguish between different emotional states helps clients better understand their experiences."
    ];
    
    return generalInsights[Math.floor(Math.random() * generalInsights.length)];
  }
  
  return '';
};

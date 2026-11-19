import { Heading, Section, Stack, Text } from "@zedtech/zedkit-ui";
import { FollowProgressForm } from "@/components/site-chrome/follow-progress-form";
import {
  HOME_MARKETING_ROOT_PROPS,
  HOME_PERSUASION_TEXT_CLASS,
  HOME_READING_REVEAL_PROPS,
  HOME_SECTION_CONTENT_GAP,
} from "../home-rhythm";
import { homeFollowCopy } from "../i18n/home-follow-copy";

/**
 * After the closing prompt: the home landing's dedicated follow-progress
 * ask, for visitors who skipped or missed the once-per-visitor welcome
 * popup. Same form, fuller framing.
 */
export function HomeFollowSection() {
  return (
    <Section
      bleed
      tone="muted"
      spacing="md"
      containerWidth="wide"
      id="follow"
      aria-labelledby="follow-heading"
      snap="none"
      {...HOME_MARKETING_ROOT_PROPS}
    >
      <Stack
        gap={HOME_SECTION_CONTENT_GAP}
        className="mx-auto w-full max-w-reading content-offset"
        data-home-follow=""
        {...HOME_READING_REVEAL_PROPS}
      >
        <Heading id="follow-heading" level={2} typeRole="title">
          {homeFollowCopy.section.title}
        </Heading>
        <Text variant="muted" className={HOME_PERSUASION_TEXT_CLASS}>
          {homeFollowCopy.section.description}
        </Text>
        <FollowProgressForm />
      </Stack>
    </Section>
  );
}

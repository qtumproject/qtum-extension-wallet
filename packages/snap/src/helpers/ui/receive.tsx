import {
  Box,
  Button,
  Card,
  Copyable,
  Divider,
  Heading,
  Image,
  Section,
  Selector,
  SelectorOption,
  Text,
} from '@metamask/snaps-sdk/jsx';

import { FOOTER_TEXT } from '@/consts';
import { Gap } from '@/helpers';
import type { ReceiveType } from '@/types';

export const renderReceive = (receive: ReceiveType) => (
  <Box
    children={[
      <Box
        direction="horizontal"
        crossAlignment="center"
        alignment="space-between"
        children={[
          <Heading children="Receive" />,
          <Selector
            name="receive-type"
            title="Select format"
            children={[
              <SelectorOption
                key="qtum"
                value="qtum"
                children={<Card title="Qtum" value="" />}
              />,
              <SelectorOption
                key="hexadecimal"
                value="hexadecimal"
                children={<Card title="Hexadecimal" value="" />}
              />,
            ]}
          />,
        ]}
      />,
      <Divider />,
      receive.type === 'qtum' && (
        <Box
          children={[
            <Box
              direction="horizontal"
              alignment="space-between"
              children={[
                <Gap />,
                <Image src={receive.qrCodes.qtum} alt="Qtum Address" />,
                <Gap />,
              ]}
            />,
            <Box
              children={[
                <Text
                  alignment="center"
                  size="sm"
                  color="muted"
                  children="Your Qtum address"
                />,
                <Copyable value={receive.address.qtum} />,
              ]}
            />,
          ]}
        />
      ),
      receive.type === 'hexadecimal' && (
        <Box
          children={[
            <Box
              direction="horizontal"
              alignment="space-between"
              children={[
                <Gap />,
                <Image
                  src={receive.qrCodes.hexadecimal}
                  alt="Qtum Address in Hexadecimal"
                />,
                <Gap />,
              ]}
            />,
            <Box
              children={[
                <Text
                  alignment="center"
                  size="sm"
                  color="muted"
                  children="Your Qtum address in Hexadecimal format"
                />,
                <Copyable value={receive.address.hexadecimal} />,
              ]}
            />,
          ]}
        />
      ),
      <Divider />,
      <Section
        children={
          <Button
            name="back-to-dashboard"
            variant="destructive"
            children="Back"
          />
        }
      />,
      <Text
        size="sm"
        alignment="center"
        color="muted"
        children={FOOTER_TEXT}
      />,
    ]}
  />
);

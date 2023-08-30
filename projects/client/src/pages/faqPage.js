import { Box, Center, Flex } from "@chakra-ui/react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";
import Navbar from "../components/website/navbar";
import Footer from "../components/website/footer";
import { Link } from "react-router-dom";

export default function FaqPage() {
  return (
    <Center flexDir={"column"}>
      <Navbar />

      <Flex
        w={"100%"}
        maxW={"1535px"}
        zIndex={1}
        p={"1rem 1rem"}
        mt={"100px"}
        gap={1}
        flexDir={"column"}
      >
        <Box fontSize={"30px"} fontWeight={"bold"}>
          FREQUENTLY ASKED QUESTIONS
        </Box>
        <Box className="faqpage">
          <Flex flexDir={"column"}>
            <Box fontSize={"20px"} fontWeight={"bold"} my={5}>
              TOP QUESTIONS
            </Box>
            <Accordion allowToggle>
              <AccordionItem>
                <AccordionButton>
                  <Box as="span" flex="1" textAlign="left">
                    Where is my order ?
                  </Box>
                  <AccordionIcon />
                </AccordionButton>

                <AccordionPanel
                  p={2}
                  gap={2}
                  display={"flex"}
                  flexDir={"column"}
                >
                  <Flex>
                    1. you must
                    <Link to={"/auth"}>
                      <Box
                        px={1}
                        _hover={{ color: "blue.500" }}
                        textDecor={"underline"}
                      >
                        login
                      </Box>
                    </Link>
                    fisrt for create order
                  </Flex>
                  <Flex>
                    2. if you alredy login, go to
                    <Link to={"/my-account"}>
                      <Box
                        px={1}
                        _hover={{ color: "blue.500" }}
                        textDecor={"underline"}
                      >
                        profile
                      </Box>
                    </Link>
                    and click order list
                  </Flex>
                  <Box>3. you can see your order list</Box>
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <AccordionButton>
                  <Box as="span" flex="1" textAlign="left">
                    Do you offer exchanges ?
                  </Box>
                  <AccordionIcon />
                </AccordionButton>

                <AccordionPanel p={2}>
                  Foothub does not currently offer online exchanges, but please
                  contact Customer Service and we'll be happy to help. You may
                  exchange an online order in any Foothub store or Foothub
                  Outlet. If you choose to exchange in store, we recommend
                  calling your local Foothub retail store in advance to confirm
                  they have the item you are looking for.
                </AccordionPanel>
              </AccordionItem>
              <AccordionItem>
                <AccordionButton>
                  <Box as="span" flex="1" textAlign="left">
                    What is your return policy ?
                  </Box>
                  <AccordionIcon />
                </AccordionButton>

                <AccordionPanel p={2}>
                  <Box fontWeight={"bold"}>
                    Purchases made on Foothub.com can be returned within 60 days
                    of receiving the product(s).
                  </Box>
                  Custom products are not subject for return. Purchases made at
                  a Foothub retail location currently are unable to be returned
                  via mail and need to be returned to a Foothub retail location.
                  Refunds are processed based on applicable product and tax
                  charges. Original shipping charges are not refunded. Refunds
                  are issued to the original form of payment. If you originally
                  made your purchase with Klarna or a Foothub gift card, please
                  see the "How do I return my Klarna order?" or "How do I return
                  my purchase made with a Foothub gift card" FAQs.
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </Flex>
          <Flex flexDir={"column"}>
            <Box fontSize={"20px"} fontWeight={"bold"} my={5}>
              SHIPPING
            </Box>
            <Accordion allowToggle>
              <AccordionItem>
                <AccordionButton>
                  <Box as="span" flex="1" textAlign="left">
                    Do you ship internationally?
                  </Box>
                  <AccordionIcon />
                </AccordionButton>

                <AccordionPanel p={2}>
                  For Foothub.com, we only ship orders within the Indonesia. If
                  you are outside of the Indonesia, check our other
                  international sites by clicking the flag drop down at the
                  bottom right of the page.
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <AccordionButton>
                  <Box as="span" flex="1" textAlign="left">
                    When will I be charged for my order, if i buy online and
                    pickup in store ?
                  </Box>
                  <AccordionIcon />
                </AccordionButton>

                <AccordionPanel p={2}>
                  We’ll only charge your method of payment after your order has
                  been picked up. However, we may put an authorization hold on
                  your debit/credit card when you place your order, which should
                  be removed by your card-issuing bank once your card has been
                  charged. Please note, Foothub doesn’t control how long
                  authorization holds stay on your account. You may call your
                  card-issuing bank if you have further questions.
                </AccordionPanel>
              </AccordionItem>
              <AccordionItem>
                <AccordionButton>
                  <Box as="span" flex="1" textAlign="left">
                    What days do you offer delivery ?
                  </Box>
                  <AccordionIcon />
                </AccordionButton>

                <AccordionPanel p={2}>
                  Orders shipped by express or standard shipping deliver on
                  business days only (Monday through Friday), excluding
                  holidays.
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </Flex>
          <Flex flexDir={"column"}>
            <Box fontSize={"20px"} fontWeight={"bold"} my={5}>
              ORDERING
            </Box>
            <Accordion allowToggle>
              <AccordionItem>
                <AccordionButton>
                  <Box as="span" flex="1" textAlign="left">
                    where is my order?
                  </Box>
                  <AccordionIcon />
                </AccordionButton>

                <AccordionPanel
                  p={2}
                  gap={2}
                  display={"flex"}
                  flexDir={"column"}
                >
                  <Flex>
                    1. you must
                    <Link to={"/auth"}>
                      <Box
                        px={1}
                        _hover={{ color: "blue.500" }}
                        textDecor={"underline"}
                      >
                        login
                      </Box>
                    </Link>
                    fisrt for create order
                  </Flex>
                  <Flex>
                    2. if you alredy login, go to
                    <Link to={"/my-account"}>
                      <Box
                        px={1}
                        _hover={{ color: "blue.500" }}
                        textDecor={"underline"}
                      >
                        profile
                      </Box>
                    </Link>
                    and click order list
                  </Flex>
                  <Box>3. you can see your order list</Box>
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <AccordionButton>
                  <Box as="span" flex="1" textAlign="left">
                    Will I be charged for the portion of my order that did not
                    ship ?
                  </Box>
                  <AccordionIcon />
                </AccordionButton>

                <AccordionPanel p={2}>
                  No, if an item you have selected is out of stock, you will not
                  be charged for the out of stock item. We will notify you
                  regarding your updated order status.
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <AccordionButton>
                  <Box as="span" flex="1" textAlign="left">
                    What do I do if I made an error on my email address
                  </Box>
                  <AccordionIcon />
                </AccordionButton>

                <AccordionPanel p={2}>
                  Contact customer service and they can manually update your
                  email address.
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </Flex>
        </Box>
      </Flex>
      <Footer />
    </Center>
  );
}

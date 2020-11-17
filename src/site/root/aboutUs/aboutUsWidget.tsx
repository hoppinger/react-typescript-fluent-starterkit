import { any, async, fromJSX, Unit } from "widgets-for-react"
import React from 'react';
import { StandardLocalWidget, Updater } from "../../../widgets-extras";
import { AboutUsState, aboutUsUpdaters, TeamMemberId, TeamMember } from "./aboutUsState";
import { Form, Button, InputGroup, CardDeck, Row, Col, Card } from "react-bootstrap";
import { validations } from "../../../shared";
import { AnimatePresence, AnimateSharedLayout, motion } from "framer-motion";
import { Range } from "immutable";
import { AboutUsLayout } from "./aboutUsLayout";

export const aboutUsWidget : StandardLocalWidget<AboutUsState> = currentState => 
  any<Updater<AboutUsState>>()([
    async<Array<TeamMember>>()(currentState.teamMembers).map(aboutUsUpdaters.teamMembers),
    fromJSX((setState:(_:Updater<AboutUsState>) => void) =>
      currentState.teamMembers.kind == "loaded" ?
        <AboutUsLayout.TeamMembersCards teamMembers={currentState.teamMembers.value} />
      :
        <AboutUsLayout.Loading />
    )
  ])
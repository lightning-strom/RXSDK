//
//  RXVKIDBridge.swift
//  RXVKSDK
//
//  Created by 陈汉 on 2026/5/14.
//

import Foundation
import UIKit
import VKID

@objc(RXVKIDBridge)
@objcMembers
final class RXVKIDBridge: NSObject {
    private static let instance = RXVKIDBridge()

    private var vkid: VKID?
    private var currentSession: UserSession?

    class func sharedBridge() -> RXVKIDBridge {
        return instance
    }

    @objc(registerWithClientId:clientSecret:)
    func register(clientId: String, clientSecret: String) -> NSError? {
        do {
            try VKID.shared.set(
                config: Configuration(
                    appCredentials: AppCredentials(
                        clientId: clientId,
                        clientSecret: clientSecret
                    )
                )
            )
            self.vkid = VKID.shared
            return nil
        } catch {
            return error as NSError
        }
    }

    @objc(openURL:)
    func openURL(_ url: URL) -> Bool {
        return self.vkid?.open(url: url) ?? false
    }

    @objc(authorizeWithPresentingViewController:completion:)
    func authorize(
        presentingViewController: UIViewController,
        completion: @escaping (NSDictionary?, NSError?) -> Void
    ) {
        guard let vkid else {
            completion(nil, self.makeError(code: -1, message: "VKID is not registered"))
            return
        }

        vkid.authorize(using: .uiViewController(presentingViewController)) { [weak self] result in
            switch result {
            case .success(let session):
                self?.currentSession = session
                completion(self?.response(from: session), nil)
            case .failure(let error):
                completion(nil, error as NSError)
            }
        }
    }

    func logout() {
        self.currentSession?.logout { _ in }
        self.currentSession = nil
    }

    private func response(from session: UserSession) -> NSDictionary {
        return [
            "accessToken": session.accessToken.value,
            "refreshToken": session.refreshToken.value,
            "idToken": session.idToken.value,
            "userId": "\(session.userId.value)",
            "sessionId": session.sessionId,
            "scope": session.accessToken.scope.description,
            "tokenExpiration": NSNumber(value: session.accessToken.expirationDate.timeIntervalSince1970)
        ] as NSDictionary
    }

    private func makeError(code: Int, message: String) -> NSError {
        return NSError(
            domain: "RXVKSDK",
            code: code,
            userInfo: [NSLocalizedDescriptionKey: message]
        )
    }
}
